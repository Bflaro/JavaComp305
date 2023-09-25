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
const DebugAdapter = require("vscode-debugadapter");
const vscode_debugadapter_1 = require("vscode-debugadapter");
const mi2_1 = require("./mi2");
const settings_1 = require("./settings");
const STACK_HANDLES_START = 1000;
const VAR_HANDLES_START = 512 * 256 + 1000;
class ExtendedVariable {
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
}
class GDBDebugSession extends vscode_debugadapter_1.DebugSession {
    constructor() {
        super(...arguments);
        this.variableHandles = new vscode_debugadapter_1.Handles(VAR_HANDLES_START);
        this.variableHandlesReverse = {};
        this.settings = new settings_1.DebuggerSettings();
    }
    initializeRequest(response, args) {
        response.body.supportsSetVariable = true;
        this.sendResponse(response);
    }
    launchRequest(response, args) {
        if (!args.coverage) {
            this.coverageStatus = undefined;
        }
        this.docker = args.docker;
        this.started = false;
        this.attached = false;
        this.miDebugger = new mi2_1.MI2(args.gdbpath, args.gdbargs, args.cobcpath, args.cobcargs, args.env, args.verbose, args.noDebug, args.gdbtty);
        this.miDebugger.on("launcherror", this.launchError.bind(this));
        this.miDebugger.on("quit", this.quitEvent.bind(this));
        this.miDebugger.on("exited-normally", this.quitEvent.bind(this));
        this.miDebugger.on("stopped", this.stopEvent.bind(this));
        this.miDebugger.on("msg", this.handleMsg.bind(this));
        this.miDebugger.on("breakpoint", this.handleBreakpoint.bind(this));
        this.miDebugger.on("step-end", this.handleBreak.bind(this));
        this.miDebugger.on("step-out-end", this.handleBreak.bind(this));
        this.miDebugger.on("step-other", this.handleBreak.bind(this));
        this.miDebugger.on("signal-stop", this.handlePause.bind(this));
        this.miDebugger.on("thread-created", this.threadCreatedEvent.bind(this));
        this.miDebugger.on("thread-exited", this.threadExitedEvent.bind(this));
        this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
        this.quit = false;
        this.needContinue = false;
        this.crashed = false;
        this.debugReady = false;
        this.useVarObjects = false;
        this.miDebugger.load(args.cwd, args.target, args.arguments, args.group, args.gdbtty).then(() => {
            setTimeout(() => {
                this.miDebugger.emit("ui-break-done");
            }, 50);
            this.sendResponse(response);
            this.miDebugger.start().then(() => {
                this.started = true;
                if (this.crashed)
                    this.handlePause(undefined);
            }, err => {
                this.sendErrorResponse(response, 100, `Failed to start MI Debugger: ${err.toString()}`);
            });
        }, err => {
            this.sendErrorResponse(response, 103, `Failed to load MI Debugger: ${err.toString()}`);
        });
    }
    attachRequest(response, args) {
        if (!args.pid && !args.remoteDebugger) {
            this.sendErrorResponse(response, 100, `Failed to start MI Debugger: pid or remoteDebugger is mandatory`);
            return;
        }
        this.coverageStatus = undefined;
        this.attached = true;
        this.started = false;
        this.miDebugger = new mi2_1.MI2(args.gdbpath, args.gdbargs, args.cobcpath, args.cobcargs, args.env, args.verbose, false, false);
        this.miDebugger.on("launcherror", this.launchError.bind(this));
        this.miDebugger.on("quit", this.quitEvent.bind(this));
        this.miDebugger.on("exited-normally", this.quitEvent.bind(this));
        this.miDebugger.on("stopped", this.stopEvent.bind(this));
        this.miDebugger.on("msg", this.handleMsg.bind(this));
        this.miDebugger.on("breakpoint", this.handleBreakpoint.bind(this));
        this.miDebugger.on("step-end", this.handleBreak.bind(this));
        this.miDebugger.on("step-out-end", this.handleBreak.bind(this));
        this.miDebugger.on("step-other", this.handleBreak.bind(this));
        this.miDebugger.on("signal-stop", this.handlePause.bind(this));
        this.miDebugger.on("thread-created", this.threadCreatedEvent.bind(this));
        this.miDebugger.on("thread-exited", this.threadExitedEvent.bind(this));
        this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
        this.quit = false;
        this.needContinue = true;
        this.crashed = false;
        this.debugReady = false;
        this.useVarObjects = false;
        this.miDebugger.attach(args.cwd, args.target, args.arguments, args.group).then(() => {
            setTimeout(() => {
                this.miDebugger.emit("ui-break-done");
            }, 50);
            this.sendResponse(response);
            this.miDebugger.start(args.pid || args.remoteDebugger).then(() => {
                this.attached = true;
                if (this.crashed)
                    this.handlePause(undefined);
            }, err => {
                this.sendErrorResponse(response, 100, `Failed to start MI Debugger: ${err.toString()}`);
            });
        }, err => {
            this.sendErrorResponse(response, 103, `Failed to load MI Debugger: ${err.toString()}`);
        });
    }
    handleMsg(type, msg) {
        if (type == "target")
            type = "stdout";
        if (type == "log")
            type = "stderr";
        this.sendEvent(new vscode_debugadapter_1.OutputEvent(msg, type));
    }
    handleBreakpoint(info) {
        const event = new vscode_debugadapter_1.StoppedEvent("breakpoint", parseInt(info.record("thread-id")));
        event.body.allThreadsStopped = info.record("stopped-threads") == "all";
        this.sendEvent(event);
    }
    handleBreak(info) {
        const event = new vscode_debugadapter_1.StoppedEvent("step", info ? parseInt(info.record("thread-id")) : 1);
        event.body.allThreadsStopped = info ? info.record("stopped-threads") == "all" : true;
        this.sendEvent(event);
    }
    handlePause(info) {
        const event = new vscode_debugadapter_1.StoppedEvent("user request", parseInt(info.record("thread-id")));
        event.body.allThreadsStopped = info.record("stopped-threads") == "all";
        this.sendEvent(event);
    }
    stopEvent(info) {
        if (!this.started)
            this.crashed = true;
        if (!this.quit) {
            const event = new vscode_debugadapter_1.StoppedEvent("exception", parseInt(info.record("thread-id")));
            event.body.allThreadsStopped = info.record("stopped-threads") == "all";
            this.sendEvent(event);
        }
    }
    threadCreatedEvent(info) {
        this.sendEvent(new vscode_debugadapter_1.ThreadEvent("started", info.record("id")));
    }
    threadExitedEvent(info) {
        this.sendEvent(new vscode_debugadapter_1.ThreadEvent("exited", info.record("id")));
    }
    quitEvent() {
        if (this.quit)
            return;
        if (this.coverageStatus !== undefined) {
            this.coverageStatus.show(this.miDebugger.getGcovFiles(), this.miDebugger.getSourceMap(), this.docker);
        }
        this.quit = true;
        this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
    }
    launchError(err) {
        this.handleMsg("stderr", "Could not start debugger process\n");
        this.handleMsg("stderr", err.toString() + "\n");
        this.quitEvent();
    }
    disconnectRequest(response, args) {
        if (this.attached)
            this.miDebugger.detach();
        else
            this.miDebugger.stop();
        this.sendResponse(response);
    }
    setVariableRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id;
                if (args.variablesReference < VAR_HANDLES_START) {
                    id = args.variablesReference - STACK_HANDLES_START;
                }
                else {
                    id = this.variableHandles.get(args.variablesReference);
                }
                let name = args.name;
                if (typeof id == "string") {
                    name = `${id}.${args.name}`;
                    if (this.showVariableDetails && args.name === "value") {
                        name = id;
                    }
                }
                if (!this.showVariableDetails || args.name === "value") {
                    yield this.miDebugger.changeVariable(name, args.value);
                    response.body = {
                        value: args.value
                    };
                }
                this.sendResponse(response);
            }
            catch (err) {
                this.sendErrorResponse(response, 11, `Could not continue: ${err}`);
            }
        });
    }
    setFunctionBreakPointsRequest(response, args) {
        const cb = (() => {
            this.debugReady = true;
            const all = [];
            args.breakpoints.forEach(brk => {
                all.push(this.miDebugger.addBreakPoint({
                    raw: brk.name,
                    condition: brk.condition,
                    countCondition: brk.hitCondition
                }));
            });
            Promise.all(all).then(brkpoints => {
                const finalBrks = [];
                brkpoints.forEach(brkp => {
                    if (brkp[0])
                        finalBrks.push({ line: brkp[1].line });
                });
                response.body = {
                    breakpoints: finalBrks
                };
                this.sendResponse(response);
            }, msg => {
                this.sendErrorResponse(response, 10, msg.toString());
            });
        }).bind(this);
        if (this.debugReady)
            cb();
        else
            this.miDebugger.once("debug-ready", cb);
    }
    setBreakPointsRequest(response, args) {
        const cb = (() => {
            this.debugReady = true;
            this.miDebugger.clearBreakPoints().then(() => {
                const path = args.source.path;
                const all = args.breakpoints.map(brk => {
                    return this.miDebugger.addBreakPoint({
                        file: path,
                        line: brk.line,
                        condition: brk.condition,
                        countCondition: brk.hitCondition
                    });
                });
                Promise.all(all).then(brkpoints => {
                    const finalBrks = [];
                    brkpoints.forEach(brkp => {
                        if (brkp[0])
                            finalBrks.push(new DebugAdapter.Breakpoint(true, brkp[1].line));
                    });
                    response.body = {
                        breakpoints: finalBrks
                    };
                    this.sendResponse(response);
                }, msg => {
                    this.sendErrorResponse(response, 9, msg.toString());
                });
            }, msg => {
                this.sendErrorResponse(response, 9, msg.toString());
            });
        }).bind(this);
        if (this.debugReady)
            cb();
        else
            this.miDebugger.once("debug-ready", cb);
    }
    threadsRequest(response) {
        if (!this.miDebugger) {
            this.sendResponse(response);
            return;
        }
        this.miDebugger.getThreads().then(threads => {
            response.body = {
                threads: []
            };
            for (const thread of threads) {
                let threadName = thread.name;
                if (threadName === undefined) {
                    threadName = thread.targetId;
                }
                if (threadName === undefined) {
                    threadName = "<unnamed>";
                }
                response.body.threads.push(new vscode_debugadapter_1.Thread(thread.id, thread.id + ":" + threadName));
            }
            this.sendResponse(response);
        });
    }
    // Supports 256 threads.
    threadAndLevelToFrameId(threadId, level) {
        return level << 8 | threadId;
    }
    frameIdToThreadAndLevel(frameId) {
        return [frameId & 0xff, frameId >> 8];
    }
    stackTraceRequest(response, args) {
        this.miDebugger.getStack(args.levels, args.threadId).then(stack => {
            const ret = [];
            stack.forEach(element => {
                let source = undefined;
                const file = element.file;
                if (file) {
                    source = new vscode_debugadapter_1.Source(element.fileName, file);
                }
                ret.push(new vscode_debugadapter_1.StackFrame(this.threadAndLevelToFrameId(args.threadId, element.level), element.function + "@" + element.address, source, element.line, 0));
            });
            response.body = {
                stackFrames: ret
            };
            this.sendResponse(response);
        }, err => {
            this.sendErrorResponse(response, 12, `Failed to get Stack Trace: ${err.toString()}`);
        });
    }
    configurationDoneRequest(response, args) {
        if (this.needContinue) {
            this.miDebugger.continue().then(done => {
                this.sendResponse(response);
            }, msg => {
                this.sendErrorResponse(response, 2, `Could not continue: ${msg}`);
            });
        }
        else
            this.sendResponse(response);
    }
    scopesRequest(response, args) {
        const scopes = new Array();
        scopes.push(new vscode_debugadapter_1.Scope("Local", STACK_HANDLES_START + (parseInt(args.frameId) || 0), false));
        response.body = {
            scopes: scopes
        };
        this.sendResponse(response);
    }
    variablesRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.showVariableDetails = this.settings.displayVariableAttributes;
            let id;
            if (args.variablesReference < VAR_HANDLES_START) {
                id = args.variablesReference - STACK_HANDLES_START;
            }
            else {
                id = this.variableHandles.get(args.variablesReference);
            }
            if (typeof id == "number") {
                try {
                    const variables = [];
                    const [threadId, level] = this.frameIdToThreadAndLevel(id);
                    const stackVariables = yield this.miDebugger.getStackVariables(threadId, level);
                    for (const stackVariable of stackVariables) {
                        let reference = 0;
                        if (this.showVariableDetails || !!stackVariable.children.size) {
                            reference = this.variableHandles.create(stackVariable.cobolName);
                        }
                        let value = stackVariable.value || "null";
                        if (this.showVariableDetails) {
                            value = stackVariable.displayableType;
                        }
                        variables.push({
                            name: stackVariable.cobolName,
                            evaluateName: stackVariable.cobolName,
                            value: value,
                            type: stackVariable.displayableType,
                            variablesReference: reference
                        });
                    }
                    response.body = {
                        variables: variables
                    };
                    this.sendResponse(response);
                }
                catch (err) {
                    this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
                }
            }
            else if (typeof id == "string") {
                try {
                    // TODO: this evals on an (effectively) unknown thread for multithreaded programs.
                    const stackVariable = yield this.miDebugger.evalCobField(id, 0, 0);
                    let variables = [];
                    if (this.showVariableDetails) {
                        variables = stackVariable.toDebugProtocolVariable(this.showVariableDetails);
                    }
                    for (const child of stackVariable.children.values()) {
                        const childId = `${id}.${child.cobolName}`;
                        let reference = 0;
                        if (this.showVariableDetails || !!child.children.size) {
                            reference = this.variableHandles.create(childId);
                        }
                        let value = child.displayableType;
                        if (!this.showVariableDetails) {
                            const evaluatedChild = yield this.miDebugger.evalCobField(childId, 0, 0);
                            value = evaluatedChild.value || "null";
                        }
                        variables.push({
                            name: child.cobolName,
                            evaluateName: child.cobolName,
                            value: value,
                            type: child.displayableType,
                            variablesReference: reference
                        });
                    }
                    response.body = {
                        variables: variables
                    };
                    this.sendResponse(response);
                }
                catch (err) {
                    this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
                }
            }
            else {
                response.body = {
                    variables: []
                };
                this.sendResponse(response);
            }
        });
    }
    pauseRequest(response, args) {
        this.miDebugger.interrupt().then(done => {
            this.sendResponse(response);
        }, msg => {
            this.sendErrorResponse(response, 3, `Could not pause: ${msg}`);
        });
    }
    continueRequest(response, args) {
        this.miDebugger.continue().then(done => {
            this.sendResponse(response);
        }, msg => {
            this.sendErrorResponse(response, 2, `Could not continue: ${msg}`);
        });
    }
    stepInRequest(response, args) {
        this.miDebugger.stepInto().then(done => {
            this.sendResponse(response);
        }, msg => {
            this.sendErrorResponse(response, 4, `Could not step in: ${msg}`);
        });
    }
    stepOutRequest(response, args) {
        this.miDebugger.stepOut().then(done => {
            this.sendResponse(response);
        }, msg => {
            this.sendErrorResponse(response, 5, `Could not step out: ${msg}`);
        });
    }
    nextRequest(response, args) {
        this.miDebugger.stepOver().then(done => {
            this.sendResponse(response);
        }, msg => {
            this.sendErrorResponse(response, 6, `Could not step over: ${msg}`);
        });
    }
    evaluateRequest(response, args) {
        const [threadId, level] = this.frameIdToThreadAndLevel(args.frameId);
        if (args.context == "watch" || args.context == "variables" || args.context == "hover") {
            this.miDebugger.evalExpression(args.expression, threadId, level).then((res) => {
                response.body = {
                    variablesReference: 0,
                    result: !!res ? res : "not available"
                };
                this.sendResponse(response);
            }, msg => {
                this.sendErrorResponse(response, 7, msg.toString());
            });
        }
        else {
            this.miDebugger.sendUserInput(args.expression, threadId, level).then(output => {
                if (typeof output == "undefined")
                    response.body = {
                        result: "",
                        variablesReference: 0
                    };
                else
                    response.body = {
                        result: JSON.stringify(output),
                        variablesReference: 0
                    };
                this.sendResponse(response);
            }, msg => {
                this.sendErrorResponse(response, 8, msg.toString());
            });
        }
    }
    gotoTargetsRequest(response, args) {
        this.miDebugger.goto(args.source.path, args.line).then(done => {
            response.body = {
                targets: [{
                        id: 1,
                        label: args.source.name,
                        column: args.column,
                        line: args.line
                    }]
            };
            this.sendResponse(response);
        }, msg => {
            this.sendErrorResponse(response, 16, `Could not jump: ${msg}`);
        });
    }
    gotoRequest(response, args) {
        this.sendResponse(response);
    }
}
exports.GDBDebugSession = GDBDebugSession;
vscode_debugadapter_1.DebugSession.run(GDBDebugSession);
//# sourceMappingURL=gdb.js.map