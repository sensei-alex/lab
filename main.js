const ui = {
  editor: document.getElementById("editor"),
  modeIndicator: document.getElementById("vim-mode"),
  projectName: document.getElementById(""),
  taskId: document.getElementById(""),
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
async function main() {
  const params = getParams();
  const lesson = await getProject(params);

  setupEditor("text/x-python");

  await setupWifiRunner();
  editor.setValue(await runner.load(filename));
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
  });

  CodeMirror.commands.save = () => runner.save(filename, editor.getValue());
}

function getParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    project: params.get("project") || "0",
    task: params.get("task") || "",
    lang: params.get("lang") || "en",
  };
}

async function getProject({ project, task, lang }) {
  const response = await fetch(
    "https://lab.snlx.net/projects/" + project + ".yaml",
  );
  const data = jsyaml.load(await response.text());

  ui.lesson.innerHTML = marked.parse(data.lesson[lang]);

  const sketch = document.createElement("img");
  sketch.src = "https://lab.snlx.net/img/" + data.sketch[lang];
  ui.lesson.prepend(sketch);

  const title = document.createElement("h1");
  title.textContent = data.name[lang];
  ui.lesson.prepend(title);

  document.title = "LAB / " + data.name[lang];
}
