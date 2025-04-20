const ESPRESSIF_VENDOR_ID = 0x303a;
const RASPBERRY_VENDOR_ID = 0x2e8a;

const ui = {
  editor: document.getElementById("editor"),
  runner: document.getElementById("runner"),
};

const editor = CodeMirror(ui.editor);
const runner = { runCommand: undefined }; // runCommand(command: string) => Promise<void>

main();
function main() {
  setupEditor("text/x-python");
}

function setupEditor(language) {
  editor.setOption("theme", "ctp-mocha");
  editor.setOption("indentUnit", 4);
  editor.setOption("lineNumbers", true);
  editor.setOption("keyMap", "vim");
  editor.setOption("mode", language);
}
