function configureTerminal() {
  ui.runner.innerHTML = "";

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
  const fit = () => {
    // the library is weird
    fitAddon.fit();
    setTimeout(fitAddon.fit(), 200);
    setTimeout(fitAddon.fit(), 400);
    setTimeout(fitAddon.fit(), 600);
  };
  terminal.loadAddon(fitAddon);
  terminal.open(ui.runner);

  window.addEventListener("resize", fit);

  const write = (char) => terminal.write(char);
  const onData = (callback) => terminal.onData(callback);

  return { write, onData, fit };
}
