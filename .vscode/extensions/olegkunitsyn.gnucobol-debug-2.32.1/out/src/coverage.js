"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const os = require("os");
const nativePath = require("path");
const ChildProcess = require("child_process");
const gcov = require("gcov-parse");
class CoverageStatus {
    constructor() {
        this.coverages = [];
        this.statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
        this.RED = vscode_1.window.createTextEditorDecorationType({
            isWholeLine: true,
            rangeBehavior: vscode_1.DecorationRangeBehavior.ClosedClosed,
            outline: 'none',
            backgroundColor: 'rgba(255, 20, 20, 0.2)',
            overviewRulerColor: new vscode_1.ThemeColor('editorOverviewRuler.errorForeground'),
            overviewRulerLane: vscode_1.OverviewRulerLane.Center
        });
        this.GREEN = vscode_1.window.createTextEditorDecorationType({
            isWholeLine: true,
            rangeBehavior: vscode_1.DecorationRangeBehavior.ClosedClosed,
            outline: 'none',
            backgroundColor: 'rgba(20, 250, 20, 0.2)'
        });
        this.COMMAND = 'gdb.coverage-toggle';
        this.highlight = true;
        vscode_1.workspace.onDidOpenTextDocument(() => {
            this.updateStatus();
        });
        vscode_1.workspace.onDidCloseTextDocument(() => {
            this.updateStatus();
        });
        vscode_1.window.onDidChangeActiveTextEditor(() => {
            this.updateStatus();
        });
        vscode_1.commands.registerCommand(this.COMMAND, () => {
            this.highlight = !this.highlight;
            this.updateStatus();
        });
        this.statusBar.command = this.COMMAND;
    }
    show(gcovFiles, sourceMap, docker = undefined) {
        if (docker !== undefined) {
            for (let i = 0; i < gcovFiles.length; i++) {
                const localPath = nativePath.resolve(os.tmpdir(), nativePath.basename(gcovFiles[i]));
                ChildProcess.spawnSync('docker', ['cp', `gnucobol:${gcovFiles[i]}.gcda`, `${localPath}.gcda`]);
                ChildProcess.spawnSync('docker', ['cp', `gnucobol:${gcovFiles[i]}.gcno`, `${localPath}.gcno`]);
                gcovFiles[i] = localPath;
            }
        }
        this.coverages = gcov.parse(gcovFiles);
        this.sourceMap = sourceMap;
        this.updateStatus();
    }
    dispose() {
        this.statusBar.dispose();
    }
    updateStatus() {
        const editor = vscode_1.window.activeTextEditor;
        if (editor === undefined) {
            this.statusBar.hide();
            return;
        }
        const red = [];
        const green = [];
        for (const coverage of this.coverages) {
            for (const line of coverage.lines) {
                if (this.sourceMap.hasLineCobol(coverage.file, line.line)) {
                    const map = this.sourceMap.getLineCobol(coverage.file, line.line);
                    if (editor.document.uri.fsPath !== map.fileCobol) {
                        continue;
                    }
                    const range = new vscode_1.Range(map.lineCobol - 1, 0, map.lineCobol - 1, Number.MAX_VALUE);
                    if (line.executed) {
                        green.push(range);
                    }
                    else {
                        red.push(range);
                    }
                }
            }
        }
        if (red.length === 0 || !this.highlight) {
            editor.setDecorations(this.RED, []);
        }
        else {
            editor.setDecorations(this.RED, red);
        }
        if (green.length === 0 || !this.highlight) {
            editor.setDecorations(this.GREEN, []);
        }
        else {
            editor.setDecorations(this.GREEN, green);
        }
        this.statusBar.text = (this.highlight ? `$(eye) ` : `$(eye-closed) `) + Math.ceil(green.length * 100 / Math.max(1, red.length + green.length)) + '%';
        this.statusBar.tooltip = `Covered ${green.length} of ${red.length} lines`;
        this.statusBar.show();
    }
}
exports.CoverageStatus = CoverageStatus;
//# sourceMappingURL=coverage.js.map