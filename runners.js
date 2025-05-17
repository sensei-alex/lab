async function setupUartRunner() {
  ui.runner.innerHTML = "";

  runner.type = "uart";

  const term = configureTerminal();
  const uart = await configureUartConnection();
  const root = await pickDirectory();

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

  runner.load = async (filename, text) => {
    const fileHandle = await root.getFileHandle(filename);
    const file = await fileHandle.getFile();

    return file.text();
  };

  runner.save = async (filename, text) => {
    const fileHandle = await root.getFileHandle(filename, {
      mode: "readwrite",
    });
    const writable = await fileHandle.createWritable({ mode: "exclusive" });

    await writable.write(text).then(() => writable.close());
  };
}

async function setupWifiRunner() {
  const ip = prompt("Please enter the board's IP address");
  const response = fetch("http://" + ip + "/fs/code.py", {
    headers: {
      Authorization: "Basic " + btoa(":hunter2"),
    },
  });

  console.log(response.text());
}
