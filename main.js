const ESPRESSIF_VENDOR_ID = 0x303a;
const RASPBERRY_VENDOR_ID = 0x2e8a;

const ui = {
  editor: document.getElementById("editor"),
  runner: document.getElementById("runner"),
};

const editor = CodeMirror(ui.editor);
const runner = {};

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

async function setupUartRunner() {
  if (!("serial" in navigator)) {
    alert(
      "Please use a chromium-based browser (e.g., brave, edge, vidaldi, chrome, etc.)",
    );
    return;
  }

  runner.type = "uart";

  const uart = await configureUartConnection();
  const term = configureTerminal();

  term.bindReader((char) => uart.writer.write(char));

  while (true) {
    const { value, done } = await uart.reader.read();

    if (done) {
      uart.reader.releaseLock();
      break;
    }

    term.write(value);
  }
}

function configureTerminal() {
  const terminal = new Terminal({
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 16,
    letterSpacing: 0, // thanks https://github.com/xtermjs/xterm.js/issues/2963#issuecomment-812031516
    theme: {
      background: "#1e1e2e",
      foreground: "#cdd6f4",
      selectionBackground: "#f5e0dc",
      selectionForeground: "#1e1e2e",
      black: "#45475a",
      red: "#f38ba8",
      green: "#a6e3a1",
      yellow: "#f9e2af",
      blue: "#89b4fa",
      magenta: "#f5c2e7",
      cyan: "#94e2d5",
      white: "#bac2de",
      brightBlack: "#585b70",
      brightRed: "#f38ba8",
      brightGreen: "#a6e3a1",
      brightYellow: "#f9e2af",
      brightBlue: "#89b4fa",
      brightMagenta: "#f5c2e7",
      brightCyan: "#94e2d5",
      brightWhite: "#a6adc8",
    },
  });

  const fitAddon = new FitAddon.FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(ui.runner);

  window.addEventListener("resize", () => fitAddon.fit());

  const write = (char) => terminal.write(char);
  const bindReader = (callback) => terminal.onData(callback);

  return { write, bindReader };
}

async function configureUartConnection() {
  const port = await navigator.serial
    .requestPort({
      filters: [
        { usbVendorId: ESPRESSIF_VENDOR_ID },
        { usbVendorId: RASPBERRY_VENDOR_ID },
      ],
    })
    .catch(() => null);

  if (!port) {
    alert(
      "Can't establish the connection. Please reload the page to try again",
    );
    return;
  }

  await port.open({ baudRate: 115200 });

  const encoder = new TextEncoderStream();
  const writer = encoder.writable.getWriter();
  encoder.readable.pipeTo(port.writable);

  const textDecoder = new TextDecoderStream();
  const _readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  return { reader, writer };
}
