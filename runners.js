async function setupUartRunner() {
  ui.runner.innerHTML = "";

  runner.type = "uart";

  const term = configureTerminal();
  const uart = await configureUartConnection();

  term.fit();
  uart.write(String.fromCharCode(4)); // reset using CTRL+D

  let buffer = "";
  let resolveLastCommand = undefined;

  term.onData((char) => uart.write(char));
  uart.onData((value) => {
    buffer += value;
    term.write(value);

    if (buffer.endsWith(">>> ")) {
      resolveLastCommand?.();
    }
  });

  runner.runCommand = async (command) => {
    uart.write(command + ENTER_KEY);

    return new Promise((resolve) => {
      resolveLastCommand = resolve;
    });
  };
}
