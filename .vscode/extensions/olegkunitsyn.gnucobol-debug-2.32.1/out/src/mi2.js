"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debugger_1 = require("./debugger");
const ChildProcess = require("child_process");
const events_1 = require("events");
const parser_mi2_1 = require("./parser.mi2");
const nativePathFromPath = require("path");
const fs = require("fs");
const parser_c_1 = require("./parser.c");
const functions_1 = require("./functions");
const nativePath = {
    resolve: function (...args) {
        const nat = nativePathFromPath.resolve(...args);
        if (process.platform === "win32" && this.cobcpath === "docker" && this.gdbpath === "docker") {
            return nat.replace(/.*:/, s => "/" + s.toLowerCase().replace(":", "")).replace(/\\/g, "/");
        }
        return nat;
    },
    dirname: function (path) {
        const nat = nativePathFromPath.dirname(path);
        if (process.platform === "win32" && this.cobcpath === "docker" && this.gdbpath === "docker") {
            return nat.replace(/.*:/, s => "/" + s.toLowerCase().replace(":", "")).replace(/\\/g, "/");
        }
        return nat;
    },
    basename: function (path) {
        return nativePathFromPath.basename(path);
    },
    isAbsolute: function (path) {
        return nativePathFromPath.isAbsolute(path);
    },
    join: function (...args) {
        return nativePathFromPath.join(...args);
    },
    normalize: function (path) {
        return nativePathFromPath.normalize(path);
    }
};
const nonOutput = /(^(?:\d*|undefined)[\*\+\-\=\~\@\&\^])([^\*\+\-\=\~\@\&\^]{1,})/;
const gdbRegex = /(?:\d*|undefined)\(gdb\)/;
const numRegex = /\d+/;
const gcovRegex = /\"([0-9a-z_\-\/\s\\:]+\.o)\"/gi;
function escape(str) {
    return str.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
exports.escape = escape;
function couldBeOutput(line) {
    return !nonOutput.exec(line);
}
exports.couldBeOutput = couldBeOutput;
class MI2 extends events_1.EventEmitter {
    constructor(gdbpath, gdbArgs, cobcpath, cobcArgs, procEnv, verbose, noDebug, gdbtty) {
        super();
        this.gdbpath = gdbpath;
        this.gdbArgs = gdbArgs;
        this.cobcpath = cobcpath;
        this.cobcArgs = cobcArgs;
        this.verbose = verbose;
        this.noDebug = noDebug;
        this.gdbtty = gdbtty;
        this.gcovFiles = new Set();
        this.currentToken = 1;
        this.handlers = {};
        this.breakpoints = new Map();
        this.hasCobGetFieldStringFunction = true;
        this.hasCobPutFieldStringFunction = true;
        if (procEnv) {
            const env = {};
            // Duplicate process.env so we don't override it
            for (const key in process.env)
                if (process.env.hasOwnProperty(key)) {
                    env[key] = process.env[key];
                }
            // Overwrite with user specified variables
            for (const key in procEnv) {
                if (procEnv.hasOwnProperty(key)) {
                    if (procEnv === null) {
                        delete env[key];
                    }
                    else {
                        env[key] = procEnv[key];
                    }
                }
            }
            this.procEnv = env;
        }
    }
    load(cwd, target, targetargs, group, gdbtty) {
        if (!nativePath.isAbsolute(target) || (this.cobcpath === "docker" && this.gdbpath === "docker")) {
            target = nativePath.resolve(cwd, target);
        }
        group.forEach(e => {
            e = nativePath.join(cwd, e);
        });
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(cwd)) {
                reject(new Error("cwd does not exist."));
            }
            if (!!this.noDebug) {
                const args = this.cobcArgs
                    .concat([target])
                    .concat(group)
                    .concat(['-job=' + targetargs]);
                this.process = ChildProcess.spawn(this.cobcpath, args, { cwd: cwd, env: this.procEnv });
                this.process.stderr.on("data", ((data) => {
                    this.log("stderr", data);
                }).bind(this));
                this.process.stdout.on("data", ((data) => {
                    this.log("stdout", data);
                }).bind(this));
                this.process.on("exit", (() => {
                    this.emit("quit");
                }).bind(this));
                return;
            }
            const args = this.cobcArgs.concat([
                '-g',
                '-fsource-location',
                '-ftraceall',
                '-Q',
                '--coverage',
                '-A',
                '--coverage',
                '-v',
                target
            ]).concat(group);
            const buildProcess = ChildProcess.spawn(this.cobcpath, args, { cwd: cwd, env: this.procEnv });
            buildProcess.stderr.on('data', (data) => {
                if (this.verbose)
                    this.log("stderr", data);
                let match;
                do {
                    match = gcovRegex.exec(data);
                    if (match) {
                        this.gcovFiles.add(match[1].split('.').slice(0, -1).join('.'));
                    }
                } while (match);
            });
            buildProcess.on('exit', (code) => __awaiter(this, void 0, void 0, function* () {
                if (code !== 0) {
                    this.emit("quit");
                    return;
                }
                if (this.verbose) {
                    this.log("stderr", `COBOL file ${target} compiled with exit code: ${code}`);
                }
                try {
                    this.map = new parser_c_1.SourceMap(cwd, [target].concat(group));
                }
                catch (e) {
                    this.log('stderr', e);
                }
                if (this.verbose) {
                    this.log("stderr", this.map.toString());
                }
                target = nativePath.resolve(cwd, nativePath.basename(target));
                target = target.split('.').slice(0, -1).join('.');
                // FIXME: the following should prefix "cobcrun.exe" if in "module mode", see #13
                // FIXME: if we need this code twice then add a comment why, otherwise move to a new function
                if (process.platform === "win32" && this.cobcpath !== "docker" && this.gdbpath !== "docker") {
                    target = target + '.exe';
                }
                // 001-Extension for debugging on a separate tty using xterm - start
                let xterm_device_win = null;
                if (process.platform !== "win32" && gdbtty) {
                    let xterm_device = this.findXterm(target);
                    if (xterm_device == "") {
                        let sleepVal = this.hashCode(target);
                        this.log('stdio', 'TTY: sleep ' + sleepVal + ';');
                        let dispTarget = (target.length > 50) ? "..." + target.substr(target.length - 50, target.length) : target;
                        const xterm_args = [
                            "-title", "GnuCobol Debug - " + dispTarget,
                            "-fa", "DejaVu Sans Mono",
                            "-fs", "14",
                            "-e", "/usr/bin/tty;" +
                                "echo 'GNUCOBOL DEBUG';" +
                                "sleep " + sleepVal + ";"
                        ];
                        const xterm_process = ChildProcess.spawn("xterm", xterm_args, {
                            detached: true,
                            stdio: 'ignore',
                        });
                        xterm_process.unref();
                        const sleep = (milliseconds) => __awaiter(this, void 0, void 0, function* () {
                            yield new Promise(resolve => setTimeout(resolve, milliseconds));
                        });
                        let try_find = 0;
                        while (try_find < 4) {
                            yield sleep(500);
                            xterm_device = this.findXterm(target);
                            try_find++;
                            if (xterm_device != "")
                                break;
                        }
                        if (xterm_device === "")
                            this.log("stderr", "tty: Install 'xterm' to use gdb's tty option\n");
                    }
                    if (xterm_device.includes("pts")) {
                        this.gdbArgs.push("--tty=" + xterm_device);
                    }
                }
                else if (process.platform === "win32" && gdbtty) {
                    xterm_device_win = "yes";
                }
                // 001-End
                this.process = ChildProcess.spawn(this.gdbpath, this.gdbArgs, { cwd: cwd, env: this.procEnv });
                this.process.stdout.on("data", this.stdout.bind(this));
                this.process.stderr.on("data", ((data) => {
                    this.log("stderr", data);
                }).bind(this));
                this.process.on("exit", (() => {
                    this.emit("quit");
                }).bind(this));
                this.process.on("error", ((err) => {
                    this.emit("launcherror", err);
                }).bind(this));
                const promises = this.initCommands(target, targetargs, cwd);
                if (xterm_device_win != null)
                    promises.push(this.sendCommand("gdb-set new-console on", false));
                Promise.all(promises).then(() => {
                    this.emit("debug-ready");
                    resolve(true);
                }, reject);
            }));
        });
    }
    attach(cwd, target, targetargs, group) {
        if (!nativePath.isAbsolute(target)) {
            target = nativePath.join(cwd, target);
        }
        group.forEach(e => {
            e = nativePath.join(cwd, e);
        });
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(cwd)) {
                reject(new Error("cwd does not exist."));
            }
            const args = this.cobcArgs.concat([
                '-g',
                '-fsource-location',
                '-ftraceall',
                '-v',
                target
            ]).concat(group);
            const buildProcess = ChildProcess.spawn(this.cobcpath, args, { cwd: cwd, env: this.procEnv });
            buildProcess.stderr.on('data', (data) => {
                if (this.verbose)
                    this.log("stderr", data);
            });
            buildProcess.on('exit', (code) => {
                if (code !== 0) {
                    this.emit("quit");
                    return;
                }
                if (this.verbose) {
                    this.log("stderr", `COBOL file ${target} compiled with exit code: ${code}`);
                }
                try {
                    this.map = new parser_c_1.SourceMap(cwd, [target].concat(group));
                }
                catch (e) {
                    this.log('stderr', e);
                }
                if (this.verbose) {
                    this.log("stderr", this.map.toString());
                }
                target = nativePath.resolve(cwd, nativePath.basename(target));
                target = target.split('.').slice(0, -1).join('.');
                // FIXME: the following should prefix "cobcrun.exe" if in "module mode", see #13
                if (process.platform === "win32") {
                    target = target + '.exe';
                }
                this.process = ChildProcess.spawn(this.gdbpath, this.gdbArgs, { cwd: cwd, env: this.procEnv });
                this.process.stdout.on("data", this.stdout.bind(this));
                this.process.stderr.on("data", ((data) => {
                    this.log("stderr", data);
                }).bind(this));
                this.process.on("exit", (() => {
                    this.emit("quit");
                }).bind(this));
                this.process.on("error", ((err) => {
                    this.emit("launcherror", err);
                }).bind(this));
                const promises = this.initCommands(target, targetargs, cwd);
                Promise.all(promises).then(() => {
                    this.emit("debug-ready");
                    resolve(true);
                }, reject);
            });
        });
    }
    initCommands(target, targetargs, cwd) {
        if (!nativePath.isAbsolute(target)) {
            target = nativePath.join(cwd, target);
        }
        if (process.platform === "win32") {
            cwd = nativePath.dirname(target);
        }
        const cmds = [
            this.sendCommand("gdb-set target-async on", false),
            this.sendCommand("gdb-set print repeats 1000", false),
            this.sendCommand("gdb-set args " + targetargs, false),
            this.sendCommand("gdb-set charset UTF-8", false),
            this.sendCommand("environment-directory \"" + escape(cwd) + "\"", false),
            this.sendCommand("file-exec-and-symbols \"" + escape(target) + "\"", false),
        ];
        return cmds;
    }
    stdout(data) {
        if (this.verbose) {
            this.log("stderr", "stdout: " + data);
        }
        if (typeof data == "string") {
            this.buffer += data;
        }
        else {
            this.buffer += data.toString("utf8");
        }
        const end = this.buffer.lastIndexOf('\n');
        if (end != -1) {
            this.onOutput(this.buffer.substr(0, end));
            this.buffer = this.buffer.substr(end + 1);
        }
        if (this.buffer.length) {
            if (this.onOutputPartial(this.buffer)) {
                this.buffer = "";
            }
        }
    }
    stderr(data) {
        if (this.verbose) {
            this.log("stderr", "stderr: " + data);
        }
        if (typeof data == "string") {
            this.errbuf += data;
        }
        else {
            this.errbuf += data.toString("utf8");
        }
        const end = this.errbuf.lastIndexOf('\n');
        if (end != -1) {
            this.onOutputStderr(this.errbuf.substr(0, end));
            this.errbuf = this.errbuf.substr(end + 1);
        }
        if (this.errbuf.length) {
            this.logNoNewLine("stderr", this.errbuf);
            this.errbuf = "";
        }
    }
    stdin(data, cb) {
        if (this.isReady()) {
            if (this.verbose) {
                this.log("stderr", "stdin: " + data);
            }
            this.process.stdin.write(data + "\n", cb);
        }
    }
    onOutputStderr(lines) {
        lines = lines.split('\n');
        lines.forEach(line => {
            this.log("stderr", line);
        });
    }
    onOutputPartial(line) {
        if (couldBeOutput(line)) {
            this.logNoNewLine("stdout", line);
            return true;
        }
        return false;
    }
    onOutput(linesStr) {
        const lines = linesStr.split('\n');
        lines.forEach(line => {
            if (couldBeOutput(line)) {
                if (!gdbRegex.exec(line)) {
                    this.log("stdout", line);
                }
            }
            else {
                const parsed = parser_mi2_1.parseMI(line);
                if (this.verbose) {
                    this.log("stderr", "GDB -> App: " + JSON.stringify(parsed));
                }
                let handled = false;
                if (parsed.token !== undefined) {
                    if (this.handlers[parsed.token]) {
                        this.handlers[parsed.token](parsed);
                        delete this.handlers[parsed.token];
                        handled = true;
                    }
                }
                if (!handled && parsed.resultRecords && parsed.resultRecords.resultClass == "error") {
                    this.log("stderr", parsed.result("msg") || line);
                }
                if (parsed.outOfBandRecord) {
                    parsed.outOfBandRecord.forEach(record => {
                        if (record.isStream) {
                            this.log(record.type, record.content);
                        }
                        else {
                            if (record.type == "exec") {
                                this.emit("exec-async-output", parsed);
                                if (record.asyncClass == "running") {
                                    this.emit("running", parsed);
                                }
                                else if (record.asyncClass == "stopped") {
                                    const reason = parsed.record("reason");
                                    if (this.verbose) {
                                        this.log("stderr", "stop: " + reason);
                                    }
                                    if (reason == "breakpoint-hit") {
                                        this.emit("breakpoint", parsed);
                                    }
                                    else if (reason == "end-stepping-range") {
                                        if (!this.map.hasLineCobol(parsed.record('frame.fullname'), parseInt(parsed.record('frame.line')))) {
                                            this.lastStepCommand();
                                        }
                                        else {
                                            this.emit("step-end", parsed);
                                        }
                                    }
                                    else if (reason == "function-finished") {
                                        if (!this.map.hasLineCobol(parsed.record('frame.fullname'), parseInt(parsed.record('frame.line')))) {
                                            this.lastStepCommand();
                                        }
                                        else {
                                            this.emit("step-out-end", parsed);
                                        }
                                    }
                                    else if (reason == "signal-received") {
                                        this.emit("signal-stop", parsed);
                                    }
                                    else if (reason == "exited-normally") {
                                        this.emit("exited-normally", parsed);
                                    }
                                    else if (reason == "exited") { // exit with error code != 0
                                        if (this.verbose) {
                                            this.log("stderr", "Program exited with code " + parsed.record("exit-code"));
                                        }
                                        this.emit("quit", parsed);
                                    }
                                    else {
                                        if (!this.map.hasLineCobol(parsed.record('frame.fullname'), parseInt(parsed.record('frame.line')))) {
                                            this.continue();
                                        }
                                        else {
                                            if (this.verbose) {
                                                this.log("stderr", "Not implemented stop reason (assuming exception): " + reason);
                                            }
                                            this.emit("stopped", parsed);
                                        }
                                    }
                                }
                                else {
                                    if (this.verbose) {
                                        this.log("stderr", JSON.stringify(parsed));
                                    }
                                }
                            }
                            else if (record.type == "notify") {
                                if (record.asyncClass == "thread-created") {
                                    this.emit("thread-created", parsed);
                                }
                                else if (record.asyncClass == "thread-exited") {
                                    this.emit("thread-exited", parsed);
                                }
                            }
                        }
                    });
                    handled = true;
                }
                if (parsed.token == undefined && parsed.resultRecords == undefined && parsed.outOfBandRecord.length == 0) {
                    handled = true;
                }
                if (!handled) {
                    if (this.verbose) {
                        this.log("stderr", "Unhandled: " + JSON.stringify(parsed));
                    }
                }
            }
        });
    }
    start(attachTarget) {
        return new Promise((resolve, reject) => {
            if (!!this.noDebug) {
                return;
            }
            this.once("ui-break-done", () => {
                let command = "exec-run";
                let expectingResultClass = "running";
                if (!!attachTarget) {
                    if (/^d+$/.test(attachTarget)) {
                        command = `target-attach ${attachTarget}`;
                        expectingResultClass = "done";
                    }
                    else {
                        command = `target-select remote ${attachTarget}`;
                        expectingResultClass = "connected";
                    }
                }
                this.sendCommand(command).then((info) => {
                    if (info.resultRecords.resultClass == expectingResultClass) {
                        resolve(false);
                    }
                    else {
                        reject();
                    }
                }, reject);
            });
        });
    }
    stop() {
        const proc = this.process;
        const to = setTimeout(() => {
            process.kill(-proc.pid);
        }, 1000);
        this.process.on("exit", function (code) {
            clearTimeout(to);
        });
        this.sendCommand("gdb-exit");
    }
    detach() {
        const proc = this.process;
        const to = setTimeout(() => {
            process.kill(-proc.pid);
        }, 1000);
        this.process.on("exit", function (code) {
            clearTimeout(to);
        });
        this.sendCommand("target-detach");
    }
    interrupt() {
        if (this.verbose) {
            this.log("stderr", "interrupt");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("exec-interrupt").then((info) => {
                resolve(info.resultRecords.resultClass == "done");
            }, reject);
        });
    }
    continue() {
        if (this.verbose) {
            this.log("stderr", "continue");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("exec-continue").then((info) => {
                resolve(info.resultRecords.resultClass == "running");
            }, reject);
        });
    }
    /**
     * The command executes the line, then pauses at the next line.
     * The underlying function executes entirely.
     * FIXME: Implement execution graph instead of exec-next fallback
     */
    stepOver() {
        this.lastStepCommand = this.stepOver;
        if (this.verbose) {
            this.log("stderr", "stepOver");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("exec-next").then((info) => {
                resolve(info.resultRecords.resultClass == "running");
            }, reject);
        });
    }
    /**
     * The command executes the line, then pauses at the next line.
     * The command goes into the underlying function, then pauses at the first line.
     */
    stepInto() {
        this.lastStepCommand = this.stepInto;
        if (this.verbose) {
            this.log("stderr", "stepInto");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("exec-step").then((info) => {
                resolve(info.resultRecords.resultClass == "running");
            }, reject);
        });
    }
    /**
     * The comand executes the function, then pauses at the next line outside.
     */
    stepOut() {
        this.lastStepCommand = this.stepOut;
        if (this.verbose) {
            this.log("stderr", "stepOut");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("exec-finish").then((info) => {
                resolve(info.resultRecords.resultClass == "running");
            }, reject);
        });
    }
    goto(filename, line) {
        if (this.verbose) {
            this.log("stderr", "goto");
        }
        return new Promise((resolve, reject) => {
            const target = '"' + (filename ? escape(filename) + ":" : "") + line + '"';
            this.sendCommand("break-insert -t " + target).then(() => {
                this.sendCommand("exec-jump " + target).then((info) => {
                    resolve(info.resultRecords.resultClass == "running");
                }, reject);
            }, reject);
        });
    }
    changeVariable(name, rawValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                this.log("stderr", "changeVariable");
            }
            const functionName = yield this.getCurrentFunctionName();
            const cleanedRawValue = functions_1.cleanRawValue(rawValue);
            try {
                const variable = this.map.getVariableByCobol(`${functionName}.${name.toUpperCase()}`);
                if (variable.attribute.type === "integer") {
                    yield this.sendCommand(`gdb-set var ${variable.cName}=${cleanedRawValue}`);
                }
                else if (this.hasCobPutFieldStringFunction && variable.cName.startsWith("f_")) {
                    yield this.sendCommand(`data-evaluate-expression "(int)cob_put_field_str(&${variable.cName}, \\"${cleanedRawValue}\\")"`);
                }
                else {
                    const finalValue = variable.formatValue(cleanedRawValue);
                    let cName = variable.cName;
                    if (variable.cName.startsWith("f_")) {
                        cName += ".data";
                    }
                    yield this.sendCommand(`data-evaluate-expression "(void)memcpy(${cName}, \\"${finalValue}\\", ${variable.size})"`);
                }
            }
            catch (e) {
                if (e.message.includes("No symbol \"cob_put_field_str\"")) {
                    this.hasCobPutFieldStringFunction = false;
                    return this.changeVariable(name, rawValue);
                }
                this.log("stderr", `Failed to set cob field value on ${functionName}.${name}`);
                this.log("stderr", e.message);
                throw e;
            }
        });
    }
    loadBreakPoints(breakpoints) {
        if (this.verbose) {
            this.log("stderr", "loadBreakPoints");
        }
        const promisses = [];
        breakpoints.forEach(breakpoint => {
            promisses.push(this.addBreakPoint(breakpoint));
        });
        return Promise.all(promisses);
    }
    setBreakPointCondition(bkptNum, condition) {
        if (this.verbose) {
            this.log("stderr", "setBreakPointCondition");
        }
        return this.sendCommand("break-condition " + bkptNum + " " + condition);
    }
    addBreakPoint(breakpoint) {
        if (this.verbose) {
            this.log("stderr", "addBreakPoint ");
        }
        return new Promise((resolve, reject) => {
            if (this.breakpoints.has(breakpoint)) {
                return resolve([false, undefined]);
            }
            let location = "";
            if (breakpoint.countCondition) {
                if (breakpoint.countCondition[0] == ">") {
                    location += "-i " + numRegex.exec(breakpoint.countCondition.substr(1))[0] + " ";
                }
                else {
                    const match = numRegex.exec(breakpoint.countCondition)[0];
                    if (match.length != breakpoint.countCondition.length) {
                        this.log("stderr", "Unsupported break count expression: '" + breakpoint.countCondition + "'. Only supports 'X' for breaking once after X times or '>X' for ignoring the first X breaks");
                        location += "-t ";
                    }
                    else if (parseInt(match) != 0) {
                        location += "-t -i " + parseInt(match) + " ";
                    }
                }
            }
            const map = this.map.getLineC(breakpoint.file, breakpoint.line);
            if (map.fileC === '' && map.lineC === 0) {
                return;
            }
            if (breakpoint.raw) {
                location += '"' + escape(breakpoint.raw) + '"';
            }
            else {
                location += '"' + escape(map.fileC) + ":" + map.lineC + '"';
            }
            this.sendCommand("break-insert -f " + location).then((result) => {
                if (result.resultRecords.resultClass == "done") {
                    const bkptNum = parseInt(result.result("bkpt.number"));
                    const map = this.map.getLineCobol(result.result("bkpt.file"), parseInt(result.result("bkpt.line")));
                    const newBrk = {
                        file: map.fileCobol,
                        line: map.lineCobol,
                        condition: breakpoint.condition
                    };
                    if (breakpoint.condition) {
                        this.setBreakPointCondition(bkptNum, breakpoint.condition).then((result) => {
                            if (result.resultRecords.resultClass == "done") {
                                this.breakpoints.set(newBrk, bkptNum);
                                resolve([true, newBrk]);
                            }
                            else {
                                resolve([false, undefined]);
                            }
                        }, reject);
                    }
                    else {
                        this.breakpoints.set(newBrk, bkptNum);
                        resolve([true, newBrk]);
                    }
                }
                else {
                    reject(result);
                }
            }, reject);
        });
    }
    removeBreakPoint(breakpoint) {
        if (this.verbose) {
            this.log("stderr", "removeBreakPoint");
        }
        return new Promise((resolve, reject) => {
            if (!this.breakpoints.has(breakpoint)) {
                return resolve(false);
            }
            this.sendCommand("break-delete " + this.breakpoints.get(breakpoint)).then((result) => {
                if (result.resultRecords.resultClass == "done") {
                    this.breakpoints.delete(breakpoint);
                    resolve(true);
                }
                else
                    resolve(false);
            });
        });
    }
    clearBreakPoints() {
        if (this.verbose) {
            this.log("stderr", "clearBreakPoints");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("break-delete").then((result) => {
                if (result.resultRecords.resultClass == "done") {
                    this.breakpoints.clear();
                    resolve(true);
                }
                else
                    resolve(false);
            }, () => {
                resolve(false);
            });
        });
    }
    getThreads() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                this.log("stderr", "getThreads");
            }
            return new Promise((resolve, reject) => {
                if (!!this.noDebug) {
                    return;
                }
                this.sendCommand("thread-info").then((result) => {
                    resolve(result.result("threads").map(element => {
                        const ret = {
                            id: parseInt(parser_mi2_1.MINode.valueOf(element, "id")),
                            targetId: parser_mi2_1.MINode.valueOf(element, "target-id")
                        };
                        const name = parser_mi2_1.MINode.valueOf(element, "name");
                        if (name) {
                            ret.name = name;
                        }
                        return ret;
                    }));
                }, reject);
            });
        });
    }
    getStack(maxLevels, thread) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                this.log("stderr", "getStack");
            }
            let command = "stack-list-frames";
            if (thread != 0) {
                command += ` --thread ${thread}`;
            }
            if (maxLevels) {
                command += " 0 " + maxLevels;
            }
            const result = yield this.sendCommand(command);
            const stack = result.result("stack");
            const ret = [];
            return stack.map(element => {
                const level = parser_mi2_1.MINode.valueOf(element, "@frame.level");
                const addr = parser_mi2_1.MINode.valueOf(element, "@frame.addr");
                const func = parser_mi2_1.MINode.valueOf(element, "@frame.func");
                const filename = parser_mi2_1.MINode.valueOf(element, "@frame.file");
                let file = parser_mi2_1.MINode.valueOf(element, "@frame.fullname");
                if (file) {
                    file = nativePath.normalize(file);
                }
                const from = parseInt(parser_mi2_1.MINode.valueOf(element, "@frame.from"));
                let line = 0;
                const lnstr = parser_mi2_1.MINode.valueOf(element, "@frame.line");
                if (lnstr) {
                    line = parseInt(lnstr);
                }
                const map = this.map.getLineCobol(file, line);
                return {
                    address: addr,
                    fileName: nativePath.basename(map.fileCobol),
                    file: map.fileCobol,
                    function: func || from,
                    level: level,
                    line: map.lineCobol
                };
            });
        });
    }
    getCurrentFunctionName() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                this.log("stderr", "getCurrentFunctionName");
            }
            const response = yield this.sendCommand("stack-info-frame");
            return response.result("frame.func").toLowerCase();
        });
    }
    getStackVariables(thread, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                this.log("stderr", "getStackVariables");
            }
            const functionName = yield this.getCurrentFunctionName();
            const variablesResponse = yield this.sendCommand(`stack-list-variables --thread ${thread} --frame ${frame} --all-values`);
            const variables = variablesResponse.result("variables");
            const currentFrameVariables = new Set();
            for (const element of variables) {
                const key = parser_mi2_1.MINode.valueOf(element, "name");
                const value = parser_mi2_1.MINode.valueOf(element, "value");
                if (key.startsWith("b_")) {
                    const cobolVariable = this.map.getVariableByC(`${functionName}.${key}`);
                    if (cobolVariable) {
                        try {
                            cobolVariable.setValue(value);
                        }
                        catch (e) {
                            this.log("stderr", `Failed to set value on ${functionName}.${key}`);
                            this.log("stderr", e.message);
                            throw e;
                        }
                        currentFrameVariables.add(cobolVariable);
                    }
                }
            }
            return Array.from(currentFrameVariables);
        });
    }
    examineMemory(from, length) {
        if (this.verbose) {
            this.log("stderr", "examineMemory");
        }
        return new Promise((resolve, reject) => {
            this.sendCommand("data-read-memory-bytes 0x" + from.toString(16) + " " + length).then((result) => {
                resolve(result.result("memory[0].contents"));
            }, reject);
        });
    }
    evalExpression(expression, thread, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = yield this.getCurrentFunctionName();
            if (this.verbose) {
                this.log("stderr", "evalExpression");
            }
            let [finalExpression, variableNames] = functions_1.parseExpression(expression, functionName, this.map);
            for (const variableName of variableNames) {
                const variable = this.map.getVariableByC(`${functionName}.${variableName}`);
                if (variable) {
                    yield this.evalVariable(variable, thread, frame);
                    const value = variable.value;
                    finalExpression = `const ${variableName}=${value};` + finalExpression;
                }
            }
            try {
                const result = `${eval(finalExpression)}`;
                if (/[^0-9.\-+]/g.test(result)) {
                    return `"${result}"`;
                }
                return result;
            }
            catch (e) {
                this.log("stderr", e.message);
                return `Failed to evaluate ${expression}`;
            }
        });
    }
    evalCobField(name, thread, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = yield this.getCurrentFunctionName();
            if (this.verbose) {
                this.log("stderr", "evalCobField");
            }
            try {
                const variable = this.map.getVariableByCobol(`${functionName}.${name.toUpperCase()}`);
                return yield this.evalVariable(variable, thread, frame);
            }
            catch (e) {
                this.log("stderr", `Failed to eval cob field value on ${functionName}.${name}`);
                this.log("stderr", e.message);
                throw e;
            }
        });
    }
    evalVariable(variable, thread, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                this.log("stderr", "evalVariable");
            }
            let command = "data-evaluate-expression ";
            if (thread != 0) {
                command += `--thread ${thread} --frame ${frame} `;
            }
            if (this.hasCobGetFieldStringFunction && variable.cName.startsWith("f_")) {
                command += `"(char *)cob_get_field_str_buffered(&${variable.cName})"`;
            }
            else if (variable.cName.startsWith("f_")) {
                command += `${variable.cName}.data`;
            }
            else {
                command += variable.cName;
            }
            let dataResponse;
            let value = null;
            try {
                dataResponse = yield this.sendCommand(command);
                value = dataResponse.result("value");
                if (value === "0x0") {
                    value = null;
                }
            }
            catch (error) {
                if (error.message.includes("No symbol \"cob_get_field_str_buffered\"")) {
                    this.hasCobGetFieldStringFunction = false;
                    return this.evalVariable(variable, thread, frame);
                }
                this.log("stderr", error.message);
            }
            if (this.hasCobGetFieldStringFunction) {
                variable.setValueUsage(value);
            }
            else {
                variable.setValue(value);
            }
            return variable;
        });
    }
    logNoNewLine(type, msg) {
        this.emit("msg", type, msg);
    }
    log(type, msg) {
        this.emit("msg", type, msg[msg.length - 1] == '\n' ? msg : (msg + "\n"));
    }
    sendUserInput(command, threadId = 0, frameLevel = 0) {
        return new Promise((resolve, reject) => {
            this.stdin(command, resolve);
        });
    }
    sendCommand(command, suppressFailure = false) {
        return new Promise((resolve, reject) => {
            const sel = this.currentToken++;
            this.handlers[sel] = (node) => {
                if (node && node.resultRecords && node.resultRecords.resultClass === "error") {
                    if (suppressFailure) {
                        this.log("stderr", `WARNING: Error executing command '${command}'`);
                        resolve(node);
                    }
                    else
                        reject(new debugger_1.MIError(node.result("msg") || "Internal error", command));
                }
                else
                    resolve(node);
            };
            this.stdin(sel + "-" + command);
        });
    }
    isReady() {
        return !!this.process;
    }
    getGcovFiles() {
        return Array.from(this.gcovFiles);
    }
    getSourceMap() {
        return this.map;
    }
    findXterm(target) {
        let sleepVal = this.hashCode(target);
        let fxterm_device = "";
        var result = ChildProcess.execSync("ps -u");
        let lines = result.toString().split("\n");
        for (let key1 in lines) {
            if (lines[key1].includes("sleep " + sleepVal)) {
                let pts = lines[key1].split(/\s+/);
                for (let key2 in pts) {
                    if (pts[key2].includes("pts")) {
                        fxterm_device = "/dev/" + pts[key2];
                    }
                }
            }
        }
        return fxterm_device;
    }
    hashCode(target) {
        let strCode = "";
        for (var code = 0, i = 0, len = target.length; i < len; i++) {
            code = (31 * code + target.charCodeAt(i)) << 0;
        }
        if (code < 0)
            code *= -1;
        if (code < 900000)
            code + 900000;
        strCode = "" + code;
        return strCode;
    }
}
exports.MI2 = MI2;
//# sourceMappingURL=mi2.js.map