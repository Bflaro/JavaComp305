(()=>{"use strict";var n={75:n=>{n.exports='<!DOCTYPE html>\n\x3c!--\nCopyright 2012 Mozilla Foundation\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n\nAdobe CMap resources are covered by their own copyright but the same license:\n\n    Copyright 1990-2015 Adobe Systems Incorporated.\n\nSee https://github.com/adobe-type-tools/cmap-resources\n--\x3e\n<html dir="ltr" mozdisallowselectionprint>\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">\n    <meta name="google" content="notranslate">\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n    <title>PDF.js viewer</title>\n\n\n    <link rel="stylesheet" href="viewer.css">\n\n\n\x3c!-- This snippet is used in production (included from viewer.html) --\x3e\n<link rel="resource" type="application/l10n" href="locale/locale.properties">\n<script src="../build/pdf.js"><\/script>\n\n\n  <script src="viewer.js"><\/script>\n\n  </head>\n\n  <body tabindex="1">\n    <div id="outerContainer">\n\n      <div id="sidebarContainer">\n        <div id="toolbarSidebar">\n          <div id="toolbarSidebarLeft">\n            <div class="splitToolbarButton toggled">\n              <button id="viewThumbnail" class="toolbarButton toggled" title="Show Thumbnails" tabindex="2" data-l10n-id="thumbs">\n                 <span data-l10n-id="thumbs_label">Thumbnails</span>\n              </button>\n              <button id="viewOutline" class="toolbarButton" title="Show Document Outline (double-click to expand/collapse all items)" tabindex="3" data-l10n-id="document_outline">\n                 <span data-l10n-id="document_outline_label">Document Outline</span>\n              </button>\n              <button id="viewAttachments" class="toolbarButton" title="Show Attachments" tabindex="4" data-l10n-id="attachments">\n                 <span data-l10n-id="attachments_label">Attachments</span>\n              </button>\n              <button id="viewLayers" class="toolbarButton" title="Show Layers (double-click to reset all layers to the default state)" tabindex="5" data-l10n-id="layers">\n                 <span data-l10n-id="layers_label">Layers</span>\n              </button>\n            </div>\n          </div>\n\n          <div id="toolbarSidebarRight">\n            <div id="outlineOptionsContainer" class="hidden">\n              <div class="verticalToolbarSeparator"></div>\n\n              <button id="currentOutlineItem" class="toolbarButton" disabled="disabled" title="Find Current Outline Item" tabindex="6" data-l10n-id="current_outline_item">\n                <span data-l10n-id="current_outline_item_label">Current Outline Item</span>\n              </button>\n            </div>\n          </div>\n        </div>\n        <div id="sidebarContent">\n          <div id="thumbnailView">\n          </div>\n          <div id="outlineView" class="hidden">\n          </div>\n          <div id="attachmentsView" class="hidden">\n          </div>\n          <div id="layersView" class="hidden">\n          </div>\n        </div>\n        <div id="sidebarResizer"></div>\n      </div>  \x3c!-- sidebarContainer --\x3e\n\n      <div id="mainContainer">\n        <div class="findbar hidden doorHanger" id="findbar">\n          <div id="findbarInputContainer">\n            <input id="findInput" class="toolbarField" title="Find" placeholder="Find in document…" tabindex="91" data-l10n-id="find_input">\n            <div class="splitToolbarButton">\n              <button id="findPrevious" class="toolbarButton findPrevious" title="Find the previous occurrence of the phrase" tabindex="92" data-l10n-id="find_previous">\n                <span data-l10n-id="find_previous_label">Previous</span>\n              </button>\n              <div class="splitToolbarButtonSeparator"></div>\n              <button id="findNext" class="toolbarButton findNext" title="Find the next occurrence of the phrase" tabindex="93" data-l10n-id="find_next">\n                <span data-l10n-id="find_next_label">Next</span>\n              </button>\n            </div>\n          </div>\n\n          <div id="findbarOptionsOneContainer">\n            <input type="checkbox" id="findHighlightAll" class="toolbarField" tabindex="94">\n            <label for="findHighlightAll" class="toolbarLabel" data-l10n-id="find_highlight">Highlight all</label>\n            <input type="checkbox" id="findMatchCase" class="toolbarField" tabindex="95">\n            <label for="findMatchCase" class="toolbarLabel" data-l10n-id="find_match_case_label">Match case</label>\n          </div>\n          <div id="findbarOptionsTwoContainer">\n            <input type="checkbox" id="findEntireWord" class="toolbarField" tabindex="96">\n            <label for="findEntireWord" class="toolbarLabel" data-l10n-id="find_entire_word_label">Whole words</label>\n            <span id="findResultsCount" class="toolbarLabel hidden"></span>\n          </div>\n\n          <div id="findbarMessageContainer">\n            <span id="findMsg" class="toolbarLabel"></span>\n          </div>\n        </div>  \x3c!-- findbar --\x3e\n\n        <div id="secondaryToolbar" class="secondaryToolbar hidden doorHangerRight">\n          <div id="secondaryToolbarButtonContainer">\n            <button id="secondaryPresentationMode" class="secondaryToolbarButton hidden presentationMode visibleLargeView" title="Switch to Presentation Mode" tabindex="51" data-l10n-id="presentation_mode">\n              <span data-l10n-id="presentation_mode_label">Presentation Mode</span>\n            </button>\n\n            <button id="secondaryOpenFile" class="secondaryToolbarButton hidden openFile visibleLargeView" title="Open File" tabindex="52" data-l10n-id="open_file">\n              <span data-l10n-id="open_file_label">Open</span>\n            </button>\n\n            <button id="secondaryPrint" class="secondaryToolbarButton hidden print visibleMediumView" title="Print" tabindex="53" data-l10n-id="print">\n              <span data-l10n-id="print_label">Print</span>\n            </button>\n\n            <button id="secondaryDownload" class="secondaryToolbarButton hidden download visibleMediumView" title="Download" tabindex="54" data-l10n-id="download">\n              <span data-l10n-id="download_label">Download</span>\n            </button>\n\n            <a href="#" id="secondaryViewBookmark" class="secondaryToolbarButton hidden bookmark visibleSmallView" title="Current view (copy or open in new window)" tabindex="55" data-l10n-id="bookmark">\n              <span data-l10n-id="bookmark_label">Current View</span>\n            </a>\n\n            <button id="firstPage" class="secondaryToolbarButton firstPage" title="Go to First Page" tabindex="56" data-l10n-id="first_page">\n              <span data-l10n-id="first_page_label">Go to First Page</span>\n            </button>\n            <button id="lastPage" class="secondaryToolbarButton lastPage" title="Go to Last Page" tabindex="57" data-l10n-id="last_page">\n              <span data-l10n-id="last_page_label">Go to Last Page</span>\n            </button>\n\n            <div class="horizontalToolbarSeparator"></div>\n\n            <button id="pageRotateCw" class="secondaryToolbarButton rotateCw" title="Rotate Clockwise" tabindex="58" data-l10n-id="page_rotate_cw">\n              <span data-l10n-id="page_rotate_cw_label">Rotate Clockwise</span>\n            </button>\n            <button id="pageRotateCcw" class="secondaryToolbarButton rotateCcw" title="Rotate Counterclockwise" tabindex="59" data-l10n-id="page_rotate_ccw">\n              <span data-l10n-id="page_rotate_ccw_label">Rotate Counterclockwise</span>\n            </button>\n\n            <div class="horizontalToolbarSeparator"></div>\n\n            <button id="cursorSelectTool" class="secondaryToolbarButton selectTool toggled" title="Enable Text Selection Tool" tabindex="60" data-l10n-id="cursor_text_select_tool">\n              <span data-l10n-id="cursor_text_select_tool_label">Text Selection Tool</span>\n            </button>\n            <button id="cursorHandTool" class="secondaryToolbarButton handTool" title="Enable Hand Tool" tabindex="61" data-l10n-id="cursor_hand_tool">\n              <span data-l10n-id="cursor_hand_tool_label">Hand Tool</span>\n            </button>\n\n            <div class="horizontalToolbarSeparator"></div>\n\n            <button id="scrollVertical" class="secondaryToolbarButton scrollModeButtons scrollVertical toggled" title="Use Vertical Scrolling" tabindex="62" data-l10n-id="scroll_vertical">\n              <span data-l10n-id="scroll_vertical_label">Vertical Scrolling</span>\n            </button>\n            <button id="scrollHorizontal" class="secondaryToolbarButton scrollModeButtons scrollHorizontal" title="Use Horizontal Scrolling" tabindex="63" data-l10n-id="scroll_horizontal">\n              <span data-l10n-id="scroll_horizontal_label">Horizontal Scrolling</span>\n            </button>\n            <button id="scrollWrapped" class="secondaryToolbarButton scrollModeButtons scrollWrapped" title="Use Wrapped Scrolling" tabindex="64" data-l10n-id="scroll_wrapped">\n              <span data-l10n-id="scroll_wrapped_label">Wrapped Scrolling</span>\n            </button>\n\n            <div class="horizontalToolbarSeparator scrollModeButtons"></div>\n\n            <button id="spreadNone" class="secondaryToolbarButton spreadModeButtons spreadNone toggled" title="Do not join page spreads" tabindex="65" data-l10n-id="spread_none">\n              <span data-l10n-id="spread_none_label">No Spreads</span>\n            </button>\n            <button id="spreadOdd" class="secondaryToolbarButton spreadModeButtons spreadOdd" title="Join page spreads starting with odd-numbered pages" tabindex="66" data-l10n-id="spread_odd">\n              <span data-l10n-id="spread_odd_label">Odd Spreads</span>\n            </button>\n            <button id="spreadEven" class="secondaryToolbarButton spreadModeButtons spreadEven" title="Join page spreads starting with even-numbered pages" tabindex="67" data-l10n-id="spread_even">\n              <span data-l10n-id="spread_even_label">Even Spreads</span>\n            </button>\n\n            <div class="horizontalToolbarSeparator spreadModeButtons"></div>\n\n            <button id="documentProperties" class="secondaryToolbarButton documentProperties" title="Document Properties…" tabindex="68" data-l10n-id="document_properties">\n              <span data-l10n-id="document_properties_label">Document Properties…</span>\n            </button>\n          </div>\n        </div>  \x3c!-- secondaryToolbar --\x3e\n\n        <div class="toolbar">\n          <div id="toolbarContainer">\n            <div id="toolbarViewer">\n              <div id="toolbarViewerLeft">\n                <button id="sidebarToggle" class="toolbarButton" title="Toggle Sidebar" tabindex="11" data-l10n-id="toggle_sidebar" aria-expanded="false" aria-controls="sidebarContainer">\n                  <span data-l10n-id="toggle_sidebar_label">Toggle Sidebar</span>\n                </button>\n                <div class="toolbarButtonSpacer"></div>\n                <button id="viewFind" class="toolbarButton" title="Find in Document" tabindex="12" data-l10n-id="findbar" aria-expanded="false" aria-controls="findbar">\n                  <span data-l10n-id="findbar_label">Find</span>\n                </button>\n                <div class="splitToolbarButton hiddenSmallView">\n                  <button class="toolbarButton pageUp" title="Previous Page" id="previous" tabindex="13" data-l10n-id="previous">\n                    <span data-l10n-id="previous_label">Previous</span>\n                  </button>\n                  <div class="splitToolbarButtonSeparator"></div>\n                  <button class="toolbarButton pageDown" title="Next Page" id="next" tabindex="14" data-l10n-id="next">\n                    <span data-l10n-id="next_label">Next</span>\n                  </button>\n                </div>\n                <input type="number" id="pageNumber" class="toolbarField pageNumber" title="Page" value="1" size="4" min="1" tabindex="15" data-l10n-id="page" autocomplete="off">\n                <span id="numPages" class="toolbarLabel"></span>\n              </div>\n              <div id="toolbarViewerRight">\n                <button id="presentationMode" class="toolbarButton hidden presentationMode hiddenLargeView" title="Switch to Presentation Mode" tabindex="31" data-l10n-id="presentation_mode">\n                  <span data-l10n-id="presentation_mode_label">Presentation Mode</span>\n                </button>\n\n                <button id="openFile" class="toolbarButton hidden openFile hiddenLargeView" title="Open File" tabindex="32" data-l10n-id="open_file">\n                  <span data-l10n-id="open_file_label">Open</span>\n                </button>\n\n                <button id="print" class="toolbarButton hidden print hiddenMediumView" title="Print" tabindex="33" data-l10n-id="print">\n                  <span data-l10n-id="print_label">Print</span>\n                </button>\n\n                <button id="download" class="toolbarButton hidden download hiddenMediumView" title="Download" tabindex="34" data-l10n-id="download">\n                  <span data-l10n-id="download_label">Download</span>\n                </button>\n                <a href="#" id="viewBookmark" class="toolbarButton hidden bookmark hiddenSmallView" title="Current view (copy or open in new window)" tabindex="35" data-l10n-id="bookmark">\n                  <span data-l10n-id="bookmark_label">Current View</span>\n                </a>\n\n                <button id="secondaryToolbarToggle" class="toolbarButton" title="Tools" tabindex="36" data-l10n-id="tools" aria-expanded="false" aria-controls="secondaryToolbar">\n                  <span data-l10n-id="tools_label">Tools</span>\n                </button>\n              </div>\n              <div id="toolbarViewerMiddle">\n                <div class="splitToolbarButton">\n                  <button id="zoomOut" class="toolbarButton zoomOut" title="Zoom Out" tabindex="21" data-l10n-id="zoom_out">\n                    <span data-l10n-id="zoom_out_label">Zoom Out</span>\n                  </button>\n                  <div class="splitToolbarButtonSeparator"></div>\n                  <button id="zoomIn" class="toolbarButton zoomIn" title="Zoom In" tabindex="22" data-l10n-id="zoom_in">\n                    <span data-l10n-id="zoom_in_label">Zoom In</span>\n                   </button>\n                </div>\n                <span id="scaleSelectContainer" class="dropdownToolbarButton">\n                  <select id="scaleSelect" title="Zoom" tabindex="23" data-l10n-id="zoom">\n                    <option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="page_scale_auto">Automatic Zoom</option>\n                    <option id="pageActualOption" title="" value="page-actual" data-l10n-id="page_scale_actual">Actual Size</option>\n                    <option id="pageFitOption" title="" value="page-fit" data-l10n-id="page_scale_fit">Page Fit</option>\n                    <option id="pageWidthOption" title="" value="page-width" data-l10n-id="page_scale_width">Page Width</option>\n                    <option id="customScaleOption" title="" value="custom" disabled="disabled" hidden="true"></option>\n                    <option title="" value="0.5" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 50 }\'>50%</option>\n                    <option title="" value="0.75" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 75 }\'>75%</option>\n                    <option title="" value="1" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 100 }\'>100%</option>\n                    <option title="" value="1.25" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 125 }\'>125%</option>\n                    <option title="" value="1.5" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 150 }\'>150%</option>\n                    <option title="" value="2" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 200 }\'>200%</option>\n                    <option title="" value="3" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 300 }\'>300%</option>\n                    <option title="" value="4" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 400 }\'>400%</option>\n                  </select>\n                </span>\n              </div>\n            </div>\n            <div id="loadingBar">\n              <div class="progress">\n                <div class="glimmer">\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div id="viewerContainer" tabindex="0">\n          <div id="viewer" class="pdfViewer"></div>\n        </div>\n\n        <div id="errorWrapper" hidden=\'true\'>\n          <div id="errorMessageLeft">\n            <span id="errorMessage"></span>\n            <button id="errorShowMore" data-l10n-id="error_more_info">\n              More Information\n            </button>\n            <button id="errorShowLess" data-l10n-id="error_less_info" hidden=\'true\'>\n              Less Information\n            </button>\n          </div>\n          <div id="errorMessageRight">\n            <button id="errorClose" data-l10n-id="error_close">\n              Close\n            </button>\n          </div>\n          <div class="clearBoth"></div>\n          <textarea id="errorMoreInfo" hidden=\'true\' readonly="readonly"></textarea>\n        </div>\n      </div> \x3c!-- mainContainer --\x3e\n\n      <div id="overlayContainer" class="hidden">\n        <div id="passwordOverlay" class="container hidden">\n          <div class="dialog">\n            <div class="row">\n              <p id="passwordText" data-l10n-id="password_label">Enter the password to open this PDF file:</p>\n            </div>\n            <div class="row">\n              <input type="password" id="password" class="toolbarField">\n            </div>\n            <div class="buttonRow">\n              <button id="passwordCancel" class="overlayButton"><span data-l10n-id="password_cancel">Cancel</span></button>\n              <button id="passwordSubmit" class="overlayButton"><span data-l10n-id="password_ok">OK</span></button>\n            </div>\n          </div>\n        </div>\n        <div id="documentPropertiesOverlay" class="container hidden">\n          <div class="dialog">\n            <div class="row">\n              <span data-l10n-id="document_properties_file_name">File name:</span> <p id="fileNameField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_file_size">File size:</span> <p id="fileSizeField">-</p>\n            </div>\n            <div class="separator"></div>\n            <div class="row">\n              <span data-l10n-id="document_properties_title">Title:</span> <p id="titleField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_author">Author:</span> <p id="authorField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_subject">Subject:</span> <p id="subjectField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_keywords">Keywords:</span> <p id="keywordsField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_creation_date">Creation Date:</span> <p id="creationDateField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_modification_date">Modification Date:</span> <p id="modificationDateField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_creator">Creator:</span> <p id="creatorField">-</p>\n            </div>\n            <div class="separator"></div>\n            <div class="row">\n              <span data-l10n-id="document_properties_producer">PDF Producer:</span> <p id="producerField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_version">PDF Version:</span> <p id="versionField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_page_count">Page Count:</span> <p id="pageCountField">-</p>\n            </div>\n            <div class="row">\n              <span data-l10n-id="document_properties_page_size">Page Size:</span> <p id="pageSizeField">-</p>\n            </div>\n            <div class="separator"></div>\n            <div class="row">\n              <span data-l10n-id="document_properties_linearized">Fast Web View:</span> <p id="linearizedField">-</p>\n            </div>\n            <div class="buttonRow">\n              <button id="documentPropertiesClose" class="overlayButton"><span data-l10n-id="document_properties_close">Close</span></button>\n            </div>\n          </div>\n        </div>\n        <div id="printServiceOverlay" class="container hidden">\n          <div class="dialog">\n            <div class="row">\n              <span data-l10n-id="print_progress_message">Preparing document for printing…</span>\n            </div>\n            <div class="row">\n              <progress value="0" max="100"></progress>\n              <span data-l10n-id="print_progress_percent" data-l10n-args=\'{ "progress": 0 }\' class="relative-progress">0%</span>\n            </div>\n            <div class="buttonRow">\n              <button id="printCancel" class="overlayButton"><span data-l10n-id="print_progress_close">Cancel</span></button>\n            </div>\n          </div>\n        </div>\n      </div>  \x3c!-- overlayContainer --\x3e\n\n    </div> \x3c!-- outerContainer --\x3e\n    <div id="printContainer"></div>\n  </body>\n</html>\n'}},e={};function t(a){var i=e[a];if(void 0!==i)return i.exports;var o=e[a]={exports:{}};return n[a](o,o.exports,t),o.exports}t.d=(n,e)=>{for(var a in e)t.o(e,a)&&!t.o(n,a)&&Object.defineProperty(n,a,{enumerable:!0,get:e[a]})},t.o=(n,e)=>Object.prototype.hasOwnProperty.call(n,e),t.r=n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})};var a={};(()=>{t.r(a),t.d(a,{activate:()=>p,deactivate:()=>c});const n=require("path"),e=require("vscode");var i=t(75);function o(n){for(;n.length;){const e=n.pop();e&&e.dispose()}}class d extends class{constructor(){this._isDisposed=!1,this._disposables=[]}dispose(){this._isDisposed||(this._isDisposed=!0,o(this._disposables))}_register(n){return this._isDisposed?n.dispose():this._disposables.push(n),n}get isDisposed(){return this._isDisposed}}{constructor(n){super(),this._onDidDelete=this._register(new e.EventEmitter),this.onDidDelete=this._onDidDelete.event,this._onDidChange=this._register(new e.EventEmitter),this.onDidChange=this._onDidChange.event,this._uri=n;const t=this._register(e.workspace.createFileSystemWatcher(n.fsPath)),a=e=>{`${e}`==`${n}`&&this._onDidChange.fire(e)};this._register(t.onDidChange(a)),this._register(t.onDidCreate(a))}get uri(){return this._uri}dispose(){this._onDidDelete.fire(this.uri),super.dispose()}}class s{constructor(){this._webviews=new Set}*get(n){const e=n.toString();for(const n of this._webviews)n.resource===e&&(yield n.webviewPanel)}add(n,e){const t={resource:n.toString(),webviewPanel:e};this._webviews.add(t),e.onDidDispose((()=>{this._webviews.delete(t)}))}}const l=i.replace('<link rel="resource" type="application/l10n" href="locale/locale.properties">',"").replace('<script src="../build/pdf.js"><\/script>',"").replace('<script src="viewer.js"><\/script>',"").replace('<link rel="stylesheet" href="viewer.css">',"");class r{constructor(n){this.webviews=new s,this.extensionRoot=e.Uri.file(n.extensionPath)}static register(n){return e.window.registerCustomEditorProvider(r.viewType,new r(n),{supportsMultipleEditorsPerDocument:!1})}async openCustomDocument(n){const e=new d(n),t=[];return t.push(e.onDidChange((n=>{for(const e of this.webviews.get(n))e.webview.postMessage({action:"reload"})}))),e.onDidDelete((()=>o(t))),e}UriResolver(t){return(...a)=>t.asWebviewUri(e.Uri.file((0,n.join)(this.extensionRoot.path,...a)))}async resolveCustomEditor(n,e){this.webviews.add(n.uri,e);const t=n.uri.with({path:n.uri.path.replace(/\/[^/]+?\.\w+$/,"/")});e.webview.options={enableScripts:!0,localResourceRoots:[t,this.extensionRoot]},e.webview.html=this.getHtmlForWebview(n,e.webview)}getHtmlForWebview(n,e){const t=this.UriResolver(e),a=(...n)=>t("assets",...n),i=e.cspSource,o={docPath:`${e.asWebviewUri(n.uri)}`};return l.replace("<title>PDF.js viewer</title>",`\n<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${i}; script-src 'unsafe-inline' ${i}; style-src 'unsafe-inline' ${i}; img-src blob: data: ${i};">\n<meta id="pdf-view-config" data-config="${d=o,JSON.stringify(d).replace(/"/g,"&quot;")}">\n\n<title>PDF.js viewer</title>\n\n<link rel="stylesheet" href="${a("web","viewer.css")}">\n<link rel="stylesheet" href="${a("main.css")}">\n\n<script src="${a("build","pdf.js")}"><\/script>\n<script src="${a("build","pdf.worker.js")}"><\/script>\n<script src="${a("web","viewer.js")}"><\/script>\n<script src="${a("main.js")}"><\/script>\n\n<link rel="resource" type="application/l10n" href="${a("web","locale","locale.properties")}">`);var d}}function p(n){n.subscriptions.push(r.register(n))}function c(){}r.viewType="pdf.view"})(),module.exports=a})();