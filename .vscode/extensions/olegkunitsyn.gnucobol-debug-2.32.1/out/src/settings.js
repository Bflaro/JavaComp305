"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class DebuggerSettings {
    constructor() {
        this.extensionSettings = vscode.workspace.getConfiguration("Cobol_Debugger");
    }
    getWithFallback(settings, section) {
        const info = settings.inspect(section);
        if (info.workspaceFolderValue !== undefined) {
            return info.workspaceFolderValue;
        }
        else if (info.workspaceValue !== undefined) {
            return info.workspaceValue;
        }
        else if (info.globalValue !== undefined) {
            return info.globalValue;
        }
        return info.defaultValue;
    }
    get displayVariableAttributes() {
        return this.getWithFallback(this.extensionSettings, "display_variable_attributes");
    }
    get cwd() {
        return this.getWithFallback(this.extensionSettings, "cwd");
    }
    get target() {
        return this.getWithFallback(this.extensionSettings, "target");
    }
    get gdbpath() {
        return this.getWithFallback(this.extensionSettings, "gdbpath");
    }
    get cobcpath() {
        return this.getWithFallback(this.extensionSettings, "cobcpath");
    }
    get gdbtty() {
        return this.getWithFallback(this.extensionSettings, "gdbtty");
    }
}
exports.DebuggerSettings = DebuggerSettings;
//# sourceMappingURL=settings.js.map