# Micro Focus&trade; COBOL extension

The Micro Focus COBOL extension provides support for compiling, editing, and debugging COBOL source code in Visual Studio Code on Windows and Linux.

[Read the full documentation for Micro Focus COBOL here](https://www.microfocus.com/documentation/vscode/cobol/index.html)

Features include:

* [Editing support for COBOL code](#editing-support) - smart indenting, syntax colorization, source format and dialect recognition are available.
* [Compilation of COBOL code](#compiling-support) - supports the compiling of source files when either an Eclipse COBOL project or a Visual Studio COBOL solution file is present, or using custom build scripts.
* [Debugging of COBOL code](#debugging-support) - supports debugging of native, .NET COBOL, and JVM COBOL code
  * Debugging of native COBOL code - offers debug configurations, breakpoints, watchpoints and program breakpoints, inline values of variables, debugging of applications running on a remote machine or in an Enterprise Server instance, and just-in-time debugging (JIT).
  * .NET Core COBOL code - offers breakpoints, variables, stepping through code.
  * JVM COBOL code - offers debug configurations, breakpoints, variables, stepping through the code.

**Note:**

* Visual Studio Code version 1.73 or later is required.
* Compile and debug features are available when a compatible version of Micro Focus Visual COBOL or Enterprise Developer is installed on the same machine. See [Scope of Support](#scope-of-the-support-in-this-version) and also the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) of this extension for details.

## Help with the extension

Visit the [OpenText Community Forum](https://community.microfocus.com/cobol/visualcobol/) for help with the extension and to discuss this product with other users and Micro Focus product specialists. For help with functionality in the extension that relies on your licensed Micro Focus COBOL product, you can also contact [OpenText Customer Care](https://www.microfocus.com/en-us/support).

## Verifying the Digital Signature

The `.vsix` package for this extension can be verified using a hosted digital signature. For more details, see [Verifying the Digital Signature of a Micro Focus Extension for Visual Studio Code](https://github.com/MicroFocus/AMC-VSCode-extension-signing).

## What's new in version 1.0.49

* Support for the Micro Focus Unit Testing Framework.

## What's new in version 1.0.48

* Support for JVM COBOL debugging.

## What's new in version 1.0.47

* New Smart Edit feature has been added and can be enabled in settings. This will preserve the left hand margin when performing operations such as indent in a fixed or variable source format document.

## What's new in version 1.0.46

* With Visual COBOL 9.0 or greater installed, typing a full stop will automatically format the last paragraph. This can be disabled with the 'Format On Type' option for COBOL.

## What's new in version 1.0.45

* The extension now includes support for COBOL Notebooks. Notebooks are documents that contain a mix of markdown and COBOL code.

## What's new in version 1.0.44

* The `Micro Focus COBOL: Install Location` setting does not need to be set on Linux if the COBOL product has been installed to the default location.
* Japanese messages are displayed when using the Japanese Language Pack in a web browser.

## What's new in version 1.0.43

* The language server, project, source format and dialect status items are now displayed in the language status bar `{}`.
* COBOL directives files are now colorized.
* New code snippets have been added:
  * File read, write, sort and delete.
  * Json parse and Json generate.
  * Xml generate and Xml parse.
  * program-id with relative file.

## What's new in version 1.0.42

* New code snippets have been added:
  * dialect - a code snippet for selecting the COBOL dialect.
  * display - a code snippet for display literal.
  * $display - a code snippet for the $display statement.
  * program-id with indexed file - a code snippet for a COBOL program using an indexed file.
  * program-id with line sequential file - a code snippet for a COBOL program using a line sequential file.
  * perform varying - three new code snippets for perform varying.
  * sourceformat - a code snippet for setting sourceformat.
* The Linux MicroFocus.VSCodeJIT executable has been removed from the extension. The `debugger_command` tunable for Just-In-Time debugging must be changed to MicroFocus.VsCodeDebugProtocol for Linux and MicroFocus.VsCodeDebugProtocol64.exe for Windows in any existing `COBCONFIG` file.

## What's new in version 1.0.41

* Commands are available to create new COBOL programs.
* Commands are available to simplify registering/unregistering Just-In-Time debugging.
* Japanese messages are displayed when using the Japanese Language Pack.

## What's new in version 1.0.40

* A Debug/Run button is available for the current COBOL program.

## What's new in version 1.0.39

* Custom tab stops are now available for COBOL code.

## What's new in version 1.0.38

* A Micro Focus COBOL Terminal is now provided.

## What's new in version 1.0.36

* The debugger now includes support for the memory view when debugging native code.
* The extension settings includes an entry to allow a Consolidated Tracing Facility configuration file to be used when building and debugging.

## What's new in version 1.0.34

* Code snippets are available for COBOL code.

## What's new in version 1.0.32

* It is now possible to install this extension to edit COBOL files when you use Visual Studio Code in a Web browser.
* When COBOL tab stops are enabled, backspace now removes all spaces up to the last COBOL tab stop.
* Colorization has been improved within the Identification Division and EXEC blocks.
* Colorization has been added for the ACUCOBOL Terminal source format.

## What's new in version 1.0.29

* Watchpoints and program breakpoints are now supported in native COBOL
* Add and remove line comment commands are now supported for COBOL source files
* Tab support in COBOL sources has been improved and supports COBOL tab stops
* The values of variables are now shown inline in the editor while debugging

## Editing Support

The editor supports the following features to help you write COBOL code:

* Setting the COBOL dialect - using the COBOL Language Server functionality
* Code snippets
* Command Palette commands for commenting out lines of code
* Indenting code to COBOL rulers while preserving the left hand margin
* Commands for exploring your COBOL code - i.e. Peek, Go to Definition, Go to References
* Configuring the file encoding
* **Format Document** for formatting COBOL files
* Navigate to
* Outline view and breadcrumb navigation
* Renaming data items

See the [**full documentation**](https://www.microfocus.com/documentation/vscode/cobol/GUID-07A6E876-A375-4BCF-922A-207738843630.html) for more details.

### COBOL Language Server

The following productivity and navigation features in the editor are provided by the COBOL Language Server.

**Important:** The COBOL Language Server is provided when you have a licensed version of a Micro Focus Visual COBOL or Enterprise Developer product on the same machine.

* Context-aware code completion as you type.
* Hover pop-ups for data items - hovering data items in the source provides a basic description of the data item.
* Go to/Find/Peek definition and references - provide quick navigation from a data item to its definition or to other locations where the code references it.
* Go to/Peek definition for copy statements - hover COPY statements to view their full path.
* Collapsible regions in the editor - you can collapse sections of code in the editor.
* OUTLINE view - a tree-view outline of a COBOL program that shows the divisions, sections, and data items defined in the program.
* Error highlighting and reporting - compilation errors are highlighted in the editor and shown in the PROBLEMS section.
* Rename command available across multiple files.

See the [**full documentaton**](https://www.microfocus.com/documentation/vscode/cobol/GUID-E83BD64D-154F-417C-869F-05CE0F5B86A2.html) for more details.

### Configuring the editor

You can configure the editor with the following GUI settings:

* **Micro Focus COBOL: Dialect** - the default dialect to apply to COBOL files. Set to "**Micro Focus**" by default.  
* **Micro Focus COBOL: Source Format** - the default source format to apply to COBOL files. Set to "**fixed**" by default.

You can also set your editor preference in the global Visual Studio Code configuration file, `settings.json` (in `%userprofile%\AppData\Roaming\Code\User` (Windows) or in `~/.config/Code/User` (Linux)).
Add the Micro Focus settings in the following format: ' "*setting*": "*value*" '. For example:

```json
{
    "microFocusCOBOL.dialect": "Enterprise COBOL for z/OS",
    "microFocusCOBOL.sourceFormat": "fixed"
}
```

For example, to configure the source format and the COBOL dialect use:

* ```microFocusCOBOL.sourceFormat```: sets the default source format that is applied to COBOL documents for colorization
* ```microFocusCOBOL.dialect```: sets the default dialect that is applied to COBOL documents for colorization

To customize the colors of the COBOL words in the editor use ```editor.semanticTokenColorCustomizations``` the `"rules"` option, and with the settings prefixed `"cobol"`. For example:

```json
{
    "editor.semanticTokenColorCustomizations": {
        "enabled": true,
        "rules": {
            "cobol-identifier": "#3b8dda",
            "cobol-keyword": "#ff0000"
        }
    }
}
```

Where you can access the list of COBOL words whose color to modify if you start typing  ```cobol-```. You receive a list of suggestions to choose from.

If you would like to enable editing features that preserve the left hand margin for fixed and variable source format COBOL code, you can enable Smart Edit and improved COBOL tab stops.

```json
{
    "microFocusCOBOL.editor.improvedTabStops": true,
    "microFocusCOBOL.editor.smartEdit": true
}
```

You can customize your tab stops even further by specifying each column that should be a tab stop.

```json
{
    "microFocusCOBOL.editor.customTabStops": [6, 7, 19]
}
```

### Rulers for COBOL

The extension applies default rulers when you open a COBOL file in the editor which makes it easier to identify the COBOL areas and columns. You can configure these by changing the language defaults in the `settings.json` mechanism. For example, change the location of the rulers in the following section:

```json
{
    "[cobol]": {
        "editor.rulers": [
            6,
            7,
            72
        ]
    }
}
```

## Compiling Support

Visual Studio Code offers a number of build tasks that use the Micro Focus Visual COBOL or the Enterprise Developer Compiler to build your COBOL files. The build tasks are available from the **Terminal** menu.

### Configuring Visual Studio Code for compiling

Compiling requires a licensed Micro Focus COBOL product. Specify the location of the product in the extension setting `Micro Focus COBOL: Install Location`.
From the extension settings, specify any Ant and MSBuild settings as required.

### Compiling using a Visual Studio project

Build tasks are available out-of-the box for compiling existing MSBuild COBOL projects (`.cblproj`) that have been created using either Visual COBOL or Enterprise Developer for Visual Studio. If the folder open in Visual Studio Code contains the `.cblproj` or the `.sln` file for your COBOL sources, the `Run Build Task` command will make these available.
You can configure the build task using the `tasks.json` file as required.

### Compiling using an Eclipse project file

You must install Ant and add it to the `PATH` environment variable before you can compile projects. A build task is available for compiling existing Eclipse COBOL projects (`.cobolBuild`) files that have been created using Visual COBOL or Enterprise Developer for Eclipse. If the folder opened in Visual Studio Code contains the `.cobolBuild` file, the extension automatically generates a task for compiling the project using Ant. You can optionally configure the generated build task.

### Creating custom build tasks

Your COBOL sources might be using a custom build script to compile. In this case, we recommend defining a [custom build task](https://code.visualstudio.com/docs/editor/tasks#_custom-tasks) to invoke the build script. The extension includes a `COBOL-shell` task type that makes the required compilation tools such as `cobol.exe` (on Windows) and `cob` (on Linux) available to the build script. This requires the location of the installed COBOL product to be set in the extension settings.

See below an example COBOL build task that invokes a batch file. `cobol.exe` can then be used in the batch file to compile the COBOL sources.

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "My Cobol Build",
            "command": ".\\build.bat",
            "type": "COBOL-shell",
            "problemMatcher": [
                "$COBOLErrFormat3"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

### Using Problem Matchers

A problem matcher is a feature of Visual Studio Code. It scans the build output for error messages and converts them to errors that can be shown inside the editor or in the **Problems** panel.
If you have any custom build tasks, you need to manually enable the suitable problem matchers for them. In order to integrate a problem matcher, add the following code to the task definition inside the `tasks.json` file:

```json
"problemMatcher": [
    "$COBOLErrFormat3"
]
```

The following problem matchers are available for COBOL code:

* `$COBOLErrFormat2Copybooks` - use this followed by the `$COBOLErrFormat2` matcher
* `$COBOLErrFormat2` - matches the build output when the `errformat(2)` directive is set
* `$COBOLErrFormat3` - matches the build output when the `errformat(3)` directive in set
* `$COBOLMSBuild` - use this for COBOL MSBuild projects created with Visual COBOL or Enterprise Developer for Visual Studio
* `$COBOLAnt`- use this for COBOL Eclipse projects created with Visual COBOL or Enterprise Developer for Eclipse
* `$COBOLAntCopybooks` - use this to match errors in copybooks that get emitted by the Ant build of the COBOL Eclipse projects. This matcher can only be used together with the $COBOLAnt problem matcher. `$COBOLAntCopybooks` should precede `$COBOLAnt` in the `tasks.json` file:

```json
"problemMatcher": [
    "$COBOLAntCopybooks",
    "$COBOLAnt"
]
```

### File encodings

Visual Studio Code uses UTF8 by default when opening or creating files. To change the encoding used for COBOL files you can add the required encoding to the `settings.json` file as follows:

```json
{
    "[cobol]": {
        "files.encoding": "utf8bom"
    }
}
```

When `utf8bom` is set, the Compiler will recognise the file encoding as UTF8.

## Debugging Support

**Note:** A licensed version of Micro Focus Visual COBOL or Micro Focus Enterprise Developer must be installed on the same machine on which you are running Visual Studio Code in order for this feature to work.

### Debugging native COBOL code

Refer to the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) of the extension for all of the requirements and for examples of debugging scenarios.

The following outlines the debug process:

1. Open the folder that contains the file to debug in Visual Studio Code.
2. Click **Run > Add Configuration**.
    This creates a **launch.json** in a **.vscode** subfolder in the location of your COBOL file. The file is then opened in the editor.
3. Specify any debug properties as required - see **Specify debug properties**.
4. Open the COBOL program in the editor.
5. Add any breakpoints as required.
6. Start debugging - click **Run > Start Debugging**.

### Launch configuration file

Debugging native COBOL code requires a debug launch configuration file that specifies how to debug your COBOL programs.
The default launch configurations are **COBOL (native): Launch** and **COBOL (native): Attach to process**.

You can create additional launch configurations for other debugging scenarios in the `launch.json` file:

* With `launch.json` opened in Visual Studio Code, click **Run > Add Configuration**.

You can add one of the following configurations - COBOL (native): Launch, COBOL (native): Launch - remote, COBOL (native): Launch - 64-bit, COBOL (native): Attach to process, COBOL (native): Enterprise Server, COBOL (native): Wait for attachment. Optionally, you can add more settings to these as required.

Some of the settings you can specify are:

* `"args": [ ]` - command-line arguments for the program.
* `"cwd": "${workspaceFolder}"` - current working directory. This is set to the workspace folder, by default.
* `"env": [ {"name": "", "value": "" }]` - specify any environment variables as required.

For example, set the following to enable CTF for the program being run. It does not, on its own, result in CTF output in the Debug console. If, however, the CTF configuration file has the 'idedbg' emitter set then CTF output will be displayed in the Debug Console.

```json
    "env": [ {"name": "MFTRACE_CONFIG", "value": "d:\\trace.cfg" }]
```

* `"is64bit": true` - if you want to debug a 64-bit application. This is set to true by default on Linux.
* `"program": "${workspaceFolder}/<insert-program-name-here>"` - you can specify an executable, or a core dump file.
* `"remoteDebug"` - specify any remote debug settings. You need to have Visual COBOL or Enterprise Developer and cobdebugremote running on the remote machine:

```json
"remoteDebug": {
    "machine": "machine name or IP",
    "port": 0
}
```

When Remote debugging, file names provided by the debugger will contain paths on the remote file system which may not exist on the local file system. Adding one or more `pathMappings` maps paths from the remote file system to paths on the local file system allowing the source files to be opened.

```json
"pathMappings": [
    { 
        "remote": "<remote-path>",
        "local": "<local-path>"
    }
]
```

* `"symbolSearchPaths": []` - specify the location of the .idy files.
* `"stopOnEntry": true` - the debugger stops on the first line of debuggable code.

### Attach to process and debug

You can attach to and debug applications as running processes:

1. Ensure the application sources are stored on your local machine. Open the folder that contains the source files in Visual Studio Code.
2. Click **Debug > Start Debugging**.

    This creates a `launch.json` inside a `.vscode` subfolder of the folder that contains your sources.

3. Add the **COBOL (native): Attach to process** configuration to the `launch.json` file:

   ```json
   {
       "type": "cobol",
       "request": "attach",
       "name": "COBOL (native): Attach to process",
       "processId": "${command:pickProcess}"
   }
   ```

4. Select **COBOL (native): Attach to process** from the configuration launcher, and click **Start Debugging**.

    This opens the Attach to process widget.

5. Start typing the name of the executable you want to debug, and then select it.

### Wait for a debuggable attachment

1. Ensure the application sources are stored on your local machine. Open the folder that contains the source files in Visual Studio Code.
2. Click **Debug > Start Debugging**.

   This creates a `launch.json` inside a `.vscode` subfolder of the folder that contains your sources.

3. Add the COBOL (native): Wait for attachment configuration to the `launch.json` file:

   ```json
   {
       "type": "cobol",
       "request": "launch",
       "name": "COBOL (native): Wait for attachment",
       "waitForAttachment": { }
   }
   ```

    Where the supported `waitForAttachment` options are:

    * `any` - Waits for and then attaches to the next COBOL program that calls CBL\_DEBUGBREAK, or is launched with the COBSW environment variable set to +A.
    * `directory` - Waits for and then attaches to the next COBOL program that is launched with its working directory set to either the folder specified, or a subfolder of it.
    * `id` - Waits for and then attaches to the next COBOL program which calls CBL\_DEBUG\_START with the identifier you specify in the ID field as an argument. When using the id option the debugger always returns to the waiting state when the program being debugged exits.
    * `returnToWait` - Only supported with the `any` and `directory` options. Optional. Returns the debugger to a waiting state when the program being debugged exits.

4. Select **COBOL (native): Wait for attachment** from the configuration launcher, and click **Start Debugging**.

5. Visual Studio Code starts the debugger and displays a message **Waiting for debug connection**.

### Watchpoints

The **Run and Debug** view includes a **WATCHPOINTS** window allowing watchpoints to be set.

To add a watchpoint:

1. Select the Run and Debug view and click **WATCHPOINTS**.
2. Click +.
3. Type the name of a data item in the field and press Enter.
The watchpoint is listed in the **WATCHPOINTS** window, and is enabled by default. You can toggle this watchpoint on and off by selecting **Toggle Enable Watchpoint**. The icon will be updated accordingly.
4. To add a condition to the watchpoint (optional):

    * Click on the item in the **WATCHPOINTS** window and expand it.

    * Add one or both of the following:

      * An expression: a conditional expression, such as variable EQUALS value. (Bear in mind that 'Breaks when' is prefixed to your expression to form the complete expression. Also, there is no syntax validation of your expression; if it is syntactically incorrect, it just won't work.)

      * A hit count value: this represents the number of times that the area of memory is updated; click **Edit Hit Count** and select from the list of criteria displayed, and then enter the appropriate value. If you define both an expression and a hit count value, both criteria must be satisfied before execution will halt.

    * You can toggle the conditions on and off by selecting **Toggle Enable Conditions**. The icon to the left of the condition indicates whether the condition is enabled.

See the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) for further details.

### Program breakpoints

The **Run and Debug** view includes a **PROGRAM BREAKPOINTS** window allowing program breakpoints to be set.

To add a program breakpoint:

1. Select the Run and Debug view and click **PROGRAM BREAKPOINTS**.
2. Click +.
3. Type the name of the source file, without the extension, and press Enter. For multi-program source files, to set a break for a sub-program, use its program-id.
The program breakpoint is set.

To disable a program breakpoint:

* In the **PROGRAM BREAKPOINTS** window, select the required program breakpoint and click **Toggle Enable Program Breakpoint** to disable it.

To delete a program breakpoint:

* In the **PROGRAM BREAKPOINTS** window, select the required program breakpoint and click **Delete Program Breakpoint**, or to delete all current program breakpoints, click **Delete All Program Breakpoints** .

See the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) for further details.

### Viewing memory

In the VARIABLES view, if you select the 'View binary data' icon a memory window is displayed allowing you to view and edit data in the memory associated with the selected item.

### Debugging the current file

The current COBOL file can be debugged or run using the Debug/Run button in the top right corner of the editor.

When the button is clicked, if the workspace contains `tasks.json` with a build task containing `(compileCurrentFile)` in its label that task will be run to compile the program. If no such task exists the file will be compiled using the default directives defined in the extension setting `Micro Focus COBOL: Default Directives`.

Examples of tasks to build the current file are:

* Launching the COBOL compiler directly

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "COBOL: (compileCurrentFile)",
            "type": "COBOL-shell",
            "windows": {
                "command": "cobol.exe",
                "args": [
                    { "value": "${file}", "quoting": "escape"},
                    { "value": "anim", "quoting": "strong"},
                    { "value": "nognt", "quoting": "strong"},
                    { "value": "errformat(3)", "quoting": "strong"},
                    { "value": ";", "quoting": "strong"} 
                ]
            },
            "linux": {
                "command": "cob",
                "args": [
                    { "value": "${file}", "quoting": "escape"},
                    { "value": "-C", "quoting": "strong"},
                    { "value": "errformat(3)", "quoting": "strong"},
                ]
            },
            "problemMatcher": "$COBOLErrFormat3",
            "group": "build"
        }
    ]
}
```

* Using an MSBuild project

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "COBOL-MSBuild",
            "command": "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\MSBuild\\Current\\Bin\\MSBuild.exe",
            "buildTarget": "${workspacefolder}/test.cblproj",
            "problemMatcher": [
                "$COBOLMSBuild"
            ],
            "group": "build",
            "label": "COBOL: MSBuild (compileCurrentFile)",
            "args": [
                "/t:CompileSelected",
                "/p:CompileItems=${fileBasename}"
            ]
        }
    ]
}
```

Once the file has been compiled the debugger will be launched. If a launch configuration exists containing `(debugCurrentFile)` in the configuration name that configuration will be used when launching the debugger otherwise it is launched directly using the output from the build. A launch configuration snippet `COBOL: (debugCurrentFile)` is provided by the extension.

### Debugging .NET COBOL code

Refer to the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) of the extension for all prerequisites for .NET COBOL debugging.

Before you can debug .NET COBOL projects, you need to register the COBOL debugging support. You only need to do this once:

1. Invoke the Visual Studio Code Command Palette widget - click **Ctrl+Shift+P**.
2. Scroll down, and select the **COBOL: Register COBOL support with .NET Core debugger (vsdbg)** command. This adds the COBOL support to the .NET debugger. If Microsoft's C# extension is not installed, this action will install it as well.

To launch debugging, you must define a launch configuration in the `launch.json` file.  Note that the file includes launch configuration of type coreclr which is provided by the C# extension. The following is an example of a launch configuration:

```json
        {
            "name": ".NET Core Launch (console)",
            "type": "coreclr",
            "request": "launch",
            "preLaunchTask": "COBOL: dotnet build",
            // Specify the executable that should be debugged below
            "program": "${workspaceFolder}/bin/Debug/net6.0/demo.exe",
            "args": [],
            "cwd": "${workspaceFolder}",
            // For more information about the 'console' field, see https://aka.ms/VSCode-CS-LaunchJson-Console
            "console": "internalConsole",
            "stopAtEntry": false
        },
```

1. Click **Run > Start Debugging**, and debug your project in the usual way.

### Debugging JVM COBOL code

Refer to the  of the extension for all prerequisites for JVM COBOL debugging.

After installing this extension, you need to register JVM COBOL debugging support to be able to debug JVM projects. You only need to do this once:

1. Invoke the Visual Studio Code Command Palette widget - click **Ctrl+Shift+P**.
2. Scroll down or start typing the following, then click **Register COBOL JVM support with Java Language Server (JDT LS)** in the list. This adds the COBOL support to the JVM debugger.

Next, you need to create a `launch.json` file for your sources. See the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) for details about the available configurations for JVM COBOL.

To launch debugging:

1. Set any breakpoints in your programs as required.
2. In the EXPLORER pane, click **Run > Start Debugging**.
3. Debug your project in the usual way.
4. Check the TERMINAL, OUTPUT, and PROBLEMS pane for any messages. There is a different debug terminal for each program you debug.

## File nesting in the Explorer view

The **EXPLORER** view supports nesting related files based on their names. The `explorer.fileNesting.enabled` setting controls whether file nesting is enabled in the explorer. You can add nesting for COBOL files by adding patterns for the COBOL file extensions being used to `settings.json`. For example:

```json
{
    "explorer.fileNesting.patterns": {
        "*.cbl": "${capture}.cpy, ${capture}.cpf, ${capture}.cpv, MFU*${capture}.cpy, Test${capture}.cpy",
        "*.CBL": "${capture}.CPY, ${capture}.CPF, ${capture}.CPV, MFU*${capture}.cpy, Test${capture}.cpy"
    }
}
```

On case-sensitive file systems it may be necessary to specify both upper-case and lower-case values, as in the example above, if files using both cases exist.

## Micro Focus Unit Testing Framework support

The Micro Focus COBOL extension provides TEST EXPLORER integration for the unit-testing framework, MFUnit, provided by Visual COBOL or Enterprise Developer.

### Prerequisites

* A licensed installation of a Micro Focus Visual COBOL or Enterprise Developer product, release 9.0 or later, is required for the MFUnit support.
* Specify the location of the licensed product in the extension setting `Micro Focus COBOL: Install Location`.

### View and run unit tests

The TEST EXPLORER shows `.mfu` test fixture files inside your workspace, and enables you to run and debug them inside Visual Studio Code.  

If your sources do not have the `.mfu` files, you need to generate them using the mfurun command-line utility available from your Micro Focus Visual COBOL or Enterprise Developer product, or compile your Visual Studio or Eclipse COBOL test projects from the command-line. See *The Micro Focus Unit Testing Framework*
 in the [full documentation](https://www.microfocus.com/documentation/visual-cobol/vc-latest/VS2022/GUID-56868D50-F836-4FA3-9255-8BCE6F895D1B.html) for details.

In Visual Studio Code:

1. Compile source files as instructed in the *Compiling Support* section of the documentation.

2. After compiling, click the **Testing** icon in the sidebar to open the TEST EXPLORER. This displays all unit tests in your workspace.

3. Run the unit tests in your workspace by clicking **Run Tests** in the toolbar of the TEST EXPLORER. To run individual test files, click **Run Test** next to the file you want to run.

    The results of any tests are indicated by the symbols next to the files in TEST EXPLORER. Hover over the errors for more information. Peek view also contains additional information following the tests being run.

4. Click the **Show Output** button in the toolbar to view the **Test Output** tab in the Terminal.

5. Click the **Test Results** panel to view the output of a test.

### Debugging unit tests

1. Set breakpoints in the unit tests you want to debug.

2. Click **Debug Tests** in the toolbar of the TEST EXPLORER to debug all unit tests.

3. Click the **Debug Test** button to debug an individual test file.

## Scope of the Support in this Version

This version of the Micro Focus COBOL extension has the following limitations:

* Compiling and debugging are supported only if you have a licensed version of a Micro Focus COBOL product on the same machine. See Installing in the [full documentation](https://www.microfocus.com/documentation/vscode/cobol/index.html) for details.
* Compiling of .NET COBOL and JVM COBOL code is supported if the Visual Studio project and/or solution, or the Eclipse project, respectively, are available.
* Syntax checking is only available if version 8.0 or later of a Micro Focus COBOL product is used and some syntax colorization is not supported at the same level as in Micro Focus Visual COBOL or Enterprise Developer for Visual Studio. For example:
  * Uncompiled code and unused variables are not greyed out.
* Visual Studio Code provides suggestions as you type in the editor. When used with a version of a Micro Focus COBOL product earlier than 8.0 this functionality is not as advanced as IntelliSense in the Visual Studio editor or as Content Assist in Eclipse.
* Reading the COBOL Compiler directives set inside Eclipse COBOL project files (.cobolProj) is not supported.
* A problem matcher is not available for the errformat(1) directive.
* COBOL Notebooks:
  * Command line arguments cannot be read using `ACCEPT FROM COMMAND-LINE` when running a cell.
  * `ACCEPT` statements do not receive input when running a cell.
  * `COPY` statements do not resolve copybooks in a workspace.
  * Output is displayed in the debugger output window when debugging rather than in the notebook itself.
  * COBOL Notebooks are encoded as UTF-8 and the output when executing code cells is UTF-8. If a cell displays data items defined using `USAGE PICU` the directive `DISPLAY-PICU(UTF8)` should be added to the directives for the cell.
  * The **Debug Cell** or **Step into Cell** commands may not work if the cell has not been been run. Manually selecting the **COBOL Notebook** kernel will enable debugging.

Micro Focus Visual COBOL or Enterprise Developer provide fully-featured edit, compile and debug support. Click [here](https://www.microfocus.com/portfolio/application-modernization-and-connectivity/overview) for further details.
