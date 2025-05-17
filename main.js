const ui = {
  lesson: document.getElementById("lesson"),
  editor: document.getElementById("editor"),
  modeIndicator: document.getElementById("vim-mode"),
  projectName: document.getElementById("project-name"),
  taskId: document.getElementById("task-id"),
  runner: document.getElementById("runner"),
  nextTask: document.getElementById("next-task"),
  prevTask: document.getElementById("prev-task"),
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

  ui.prevTask.addEventListener("click", async () => {
    params.task -= 1;
    await getProject(params);
  })

  ui.nextTask.addEventListener("click", async () => {
    params.task += 1;
    await getProject(params);
  })

  setupEditor("text/x-python");

  setTimeout(async () => {
    setupWifiRunner();
    editor.setValue(await runner.load(filename));
  }, 0);
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
    project: +params.get("project") || 0,
    task: +params.get("task") || 0,
    lang: params.get("lang") || "en",
  };
}

async function getProject(props) {
  const response = await fetch(
    "https://lab.snlx.net/projects/" + props.project + ".yaml",
  );
  const project = jsyaml.load(await response.text());

  const lang = props.lang;
  const task = project.tasks[props.task];

  ui.lesson.innerHTML = marked.parse(task.lesson[lang]);

  const sketch = document.createElement("img");
  sketch.src = "https://lab.snlx.net/img/" + task.sketch[lang];
  sketch.classList.add("sketch");
  ui.lesson.prepend(sketch);

  const title = document.createElement("h2");
  title.textContent = task.name[lang];
  ui.lesson.prepend(title);

  document.title = "LAB / " + project.name[lang];
}
