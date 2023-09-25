"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const gdb_1 = require("./gdb");
const coverage_1 = require("./coverage");
const settings_1 = require("./settings");
const dockerTerminal = vscode.window.createTerminal("GnuCOBOL Docker");
const dockerMessage = "Property 'docker' is not defined in launch.json";
function activate(context) {
    const dockerStart = vscode.commands.registerCommand('gnucobol-debug.dockerStart', function () {
        let config;
        let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        for (config of vscode.workspace.getConfiguration('launch', vscode.workspace.workspaceFolders[0].uri).get('configurations')) {
            if (config.type !== 'gdb') {
                continue;
            }
            if (config.docker === undefined) {
                vscode.window.showInformationMessage(dockerMessage);
                break;
            }
            if (process.platform === "win32") {
                workspaceRoot = workspaceRoot
                    .replace(/.*:/, s => "/" + s.toLowerCase().replace(":", ""))
                    .replace(/\\/g, "/");
            }
            vscode.workspace.workspaceFolders[0].uri.fsPath
                .replace(/.*:/, s => "/" + s.toLowerCase().replace(":", "")).replace(/\\/g, "/");
            dockerTerminal.show(true);
            dockerTerminal.sendText(`docker run -d -i --name gnucobol -w ${workspaceRoot} -v ${workspaceRoot}:${workspaceRoot} ${config.docker}`);
            break;
        }
    });
    const dockerStop = vscode.commands.registerCommand('gnucobol-debug.dockerStop', function () {
        let config;
        for (config of vscode.workspace.getConfiguration('launch', vscode.workspace.workspaceFolders[0].uri).get('configurations')) {
            if (config.type !== 'gdb') {
                continue;
            }
            if (config.docker === undefined) {
                vscode.window.showInformationMessage(dockerMessage);
                break;
            }
            dockerTerminal.show(true);
            dockerTerminal.sendText(`docker rm --force gnucobol`);
            break;
        }
    });
    context.subscriptions.push(dockerStart, dockerStop, vscode.debug.registerDebugConfigurationProvider('gdb', new GdbConfigurationProvider()), vscode.debug.registerDebugAdapterDescriptorFactory('gdb', new GdbAdapterDescriptorFactory(new coverage_1.CoverageStatus(), new gdb_1.GDBDebugSession())));
}
exports.activate = activate;
function deactivate() {
    dockerTerminal.dispose();
}
exports.deactivate = deactivate;
class GdbConfigurationProvider {
    resolveDebugConfiguration(folder, config, token) {
        config.gdbargs = ["-q", "--interpreter=mi2"];
        if (config.docker !== undefined) {
            config.cobcpath = 'docker';
            config.gdbpath = 'docker';
            config.cobcargs = ['exec', '-i', 'gnucobol', 'cobc'].concat(config.cobcargs);
            config.gdbargs = ['exec', '-i', 'gnucobol', 'gdb'].concat(config.gdbargs);
        }
        const settings = new settings_1.DebuggerSettings();
        if (config.cwd === undefined) {
            config.cwd = settings.cwd;
        }
        if (config.target === undefined) {
            config.target = settings.target;
        }
        if (config.group === undefined) {
            config.group = [];
        }
        if (config.arguments === undefined) {
            config.arguments = "";
        }
        if (config.gdbpath === undefined) {
            config.gdbpath = settings.gdbpath;
        }
        if (config.cobcpath === undefined) {
            config.cobcpath = settings.cobcpath;
        }
        return config;
    }
}
class GdbAdapterDescriptorFactory {
    constructor(coverageBar, debugSession) {
        this.coverageBar = coverageBar;
        this.debugSession = debugSession;
    }
    createDebugAdapterDescriptor(session) {
        this.debugSession.coverageStatus = this.coverageBar;
        return new vscode.DebugAdapterInlineImplementation(this.debugSession);
    }
}
//# sourceMappingURL=extension.js.map