const ui = {
  editor: document.getElementById("editor"),
};

const editor = CodeMirror(ui.editor);

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
