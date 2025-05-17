const ui = {
  editor: document.getElementById("editor"),
  modeIndicator: document.getElementById("vim-mode"),
  runner: document.getElementById("runner"),
};

let filename = "code.py";
const editor = CodeMirror(ui.editor);
const runner = {
  runCommand: undefined, // runCommand(command: string) => Promise<void>
  load: undefined, // load(file: string) => Promise<void>
  save: undefined, // save(file: string, text: string) => Promise<void>
};

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
  editor.on("vim-mode-change", ({ mode, subMode }) => {
    const subModePretty = subMode ? " " + subMode.slice(0, -4) : "";

    ui.modeIndicator.textContent = (mode + subModePretty).toUpperCase();
    ui.modeIndicator.style.color = "var(--vim-" + mode + ")";
  })

  CodeMirror.commands.save = () => runner.save(filename, editor.getValue())
}
