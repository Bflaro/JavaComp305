# Changelog

All notable changes to the Micro Focus COBOL extension will be documented in this file.

## [1.0.50]

### Added

* Language Server support for the 'directives.mf' file type
  * Adds diagnostics, document outline, & completions when working in 'directives.mf' files
* Introduced new `microFocusCOBOL.mfunit.discoverers` setting for configuring where the extension will attempt to find Micro Focus Unit Testing Framework tests.
  * Defining a `discoverer` enables VsCode to find tests from build outputs and automatically populate the **TEST EXPLORER** view.

### Fixed

* DE 533022: Ensure network connections are tidied up after MFUnit test runs.
* DE 534011: Include test descriptions for MFUnit tests within the **TEST EXPLORER** view.
* DE 531015: Include TestTags for MFUnit tests within the **TEST EXPLORER** view.

## [1.0.49]

### Added

* Support for the Micro Focus Unit Testing Framework.
* The following items are available in **launch.json**:
  * The `envFile` property can be used to pass environment variables when debugging native COBOL programs.
  * The `sourceFileMap` property can be used when debugging native COBOL programs.
  * The `env` values can now use the simpler `"env-name": "env-value"` format rather than `{ "name": "env-name", "value": "env-value" }`.

### Fixed

* DE 503051: EXEC CICS WRITEQ TD is now colorized correctly.

## [1.0.48]

### Added

* Support for JVM COBOL debugging.

### Fixed

* DE 474001: Non-ASCII characters are now displayed correctly in COBOL notebook output.

## [1.0.47]

### Added

* DE 386155: Implement initial Smart Edit implementation for indentation.

### Fixed

* DE 473008: Compiler directives are now colorized correctly.
* DE 452033: The Debug/Run button is now only available when a COBOL product is installed.

## [1.0.46]

### Added

* Format selection now occurs when typing '.' for Visual COBOL 9.0+.

### Fixed

* DE 363111: EXEC HTML single quotes within double quotes no longer breaks colorization.
* DE 413149: The Debug COBOL Program button now works on RedHat.
* DE 414174: Clicking on the Project status bar item no longer results in an error.
* DE 417024: The declare verb is now colorized for native code.
* DE 427016: The language server status bar item now shows a severity indicator.

## [1.0.45]

### Added

* The extension now includes support for COBOL Notebooks. Notebooks are documents that contain a mix of markdown and COBOL code.

### Fixed

* DE 410089: The commands for items in the **PROGRAM BREAKPOINTS** and **WATCHPOINTS** views are now provided by clicking on icons.
* DE 411099: The watchpoint hit count option "When count is greater than" now displays the correct message "When count is greater than or equals".
* DE 405090: Stepping in the debugger now works correctly when using the `waitForAttach` option.
* DE 409070: Enabling a watchpoint hit count when the debugger is running now works correctly.
* DE 406173: Step-Into now works correctly when the `stopOnEntry` option is false.

## [1.0.44]

### Added

* The extension now includes support for COBOL Notebooks.
* The `Micro Focus COBOL: Install Location` setting does not need to be set on Linux if the COBOL product has been installed to the default location.
* The `Configure` commands on the source format and dialect status items are disabled when the language server is running.
* Japanese messages are displayed when using the Japanese Language Pack in a web browser.

### Fixed

* DE 405003: The Just-In-Time debugging message box can now be closed using the `Close window` menu item on the Task bar.
* DE 405111: The Just-In-Time debugging message box now shows the process ID and name.

## [1.0.43]

### Added

* The language server, project, source format and dialect status items are now displayed in the language status bar `{}`.
* COBOL directives files are now colorized.
* New snippets have been added:
  * File read, write, sort and delete.
  * Json parse and Json generate.
  * Xml generate and Xml parse.
  * program-id with relative file.

### Fixed

* DE 350041: The Debug/Run button now works without a folder or workspace being opened.
* DE 384019: The README now contains an example of how to nest COBOL files in the **EXPLORER** view.
* DE 394126: Dialog system copybooks are now recognised as COBOL files.

## [1.0.42]

### Added

* New snippets have been added:
  * dialect - a code snippet for selecting the COBOL dialect.
  * display - a code snippet for display literal.
  * $display - a code snippet for the $display statement.
  * program-id with indexed file - a code snippet for a COBOL program using an indexed file.
  * program-id with line sequential file - a code snippet for a COBOL program using a line sequential file.
  * perform varying - three new code snippets for perform varying.
  * sourceformat - a code snippet for setting sourceformat.

### Fixed

* DE 365190: E-level errors now appear in the **Problems** panel when compiling using `errformat(2)`. In addition, information errors are now included when using `errformat(3)`.
* DE 382038: The size of the extension as been reduced by removing the Linux MicroFocus.VSCodeJIT executable. The `debugger_command` tunable for Just-In-Time debugging must be changed to MicroFocus.VsCodeDebugProtocol for Linux and MicroFocus.VsCodeDebugProtocol64.exe for Windows in any existing `COBCONFIG` file.
* DE 363179: Items in the Watch view are now displayed correctly when stepping through code.
* DE 364179: When using `Attach to process` the disconnect option no longer terminates the application.

## [1.0.41]

### Fixed

* DE 363001: Visual Studio Code can now be successfully registered as the Just-In-Time debugger for COBOL when the extension is installed in a path containing spaces.
* DE 351042: Commands to create new COBOL programs are now provided.
* DE 350038: Commands in the Command Palette are now shown in the appropriate category.
* DE 296007: The 'is64bit' option can now be used for 'COBOL-shell' build tasks to allow either 32-bit or 64-bit builds on Linux.
* DE 326008: The language server now reports the MF level.

## [1.0.40]

### Added

* A Debug/Run button is available for the current COBOL program.

### Fixed

* DE 202097: Code deletion performance has been improved for large files.
* DE 296098: The debug configurations now indicate that they are for native code.

## [1.0.39]

### Added

* Custom tab stops are now available for COBOL code.

### Fixed

* DE 254015: 32-bit applications can now be debugged on RedHat Linux.
* DE 260016: IPv6 addresses can now be used when remote debugging.
* DE 235027: Step now works after Attach to process.
* DE 204166: Variables are now displayed correctly when stepping quickly through code.

## [1.0.38]

### Fixed

* DE 260017: Eclipse project files now build successfully on RedHat Linux.

## [1.0.37]

### Fixed

* DE 232007: The .cobolBuild tasks now show the subfolder name.
* DE 233002: The 'method-id' code snippets now work correctly.

## [1.0.36]

### Added

* The debugger now includes support for the memory view.
* The extension settings includes an entry to allow a Consolidated Tracing Facility configuration file to be used when building and debugging.

### Fixed

* DE 209011: Screen section (.ss) files are now colorized as COBOL.
* DE 204198: When Remote debugging the source can now be opened by using the 'pathMappings' option.
* DE 204233: Error message information is now displayed in the exception pupup when debugging.
* DE 203012: The 'Run without debugging' option now works with 64-bit applications.
* DE 69277: The prompt to register the .NET Core debugger is displayed after the extension is updated.
* DE 71149: Error information is displayed if registering the .NET Core debugger failed.
* DE 221066: Add cblproj and pliproj to the list of contributed extensions.

## [1.0.34]

### Added

* COBOL code snippets.

### Fixed

* DE 127043: A warning is now displayed when creating an Ant build task if no build file exists for an Eclipse project.
* DE 156014: A warning is displayed if file associations have been defined which conflict with this extension.
* DE 73046: The suggestions list shown when editing code now includes names containing hyphens.
* DE 116017: The extension now activates when a folder which only contains uppercase file exensions is opened.
* DE 156011: The extension activation time has been improved.

## [1.0.32]

### Fixed

* DE 57202: ACUCOBOL Terminal source format is now supported.
* DE 162083: The debugger now successfully opens a source file when debugging a program which was compiled using a relative path.

## [1.0.31]

### Added

* The extension can now be installed and used in a browser, for example in github.dev or vscode.dev.

### Fixed

* DE 58194, 57492: Improve colorization of ID paragraphs and EXEC blocks.
* DE 148055: Backspace does not take into account COBOL tabs.

## [1.0.30]

### Fixed

* The Watchpoints view should not be visible when debugging managed code.

## [1.0.29]

### Added

* Watchpoints
* Program breakpoints
* Comment/uncomment
* COBOL tab support
* Debug: Inline values

### Fixed

* DE 99135: Improved error information is displayed when incorrect settings are used when debugging an Enterprise Server application.
* DE 142061: The debugger no longer crashes on a line containing a subscripted data item with an invalid subscript.
* DE 91175: The COBOL environment is now set up for Ant builds.
* DE 101086, 98202: The README Files are now displayed correctly on the Visual Studio Marketplace.
* DE 120034: Registry access null reference in MicroFocus.VsCodeJIT.exe fixed.
