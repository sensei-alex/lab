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

  runner.load = async (filename) => {
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
  const term = configureTerminal();

  const ip = prompt("What's the IP address of the board?");

  runner.type = "wifi";

  runner.load = async (filename) => {
    const response = await fetch("http://" + ip + "/fs/" + filename, {
      headers: {
        Authorization: "Basic " + btoa(":hunter2"),
      },
    }).catch(() =>
      alert(
        "Couldn't connect. Please check that the IP is right and try again.",
      ),
    );

    return response.text();
  };

  runner.save = async (filename, text) => {
    const response = await fetch("http://" + ip + "/fs/" + filename, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(":hunter2"),
      },
      body: text,
    });

    return response.text();
  };

  const ws = new WebSocket("ws://" + ip + "/cp/serial/");

  ws.onopen = function () {
    console.log("open");
    ws.send(String.fromCharCode(3)); // Ctrl + C
    ws.send(String.fromCharCode(4)); // Ctrl + D
  };

  ws.onmessage = function ({ data }) {
    term.write(data);
    if (data === "\r" || data === "\n") {
      term.fit();
    }
  };

  term.onData((char) => ws.send(char));

  window.addEventListener("unload", function () {
    if (ws.readyState == WebSocket.OPEN) {
      ws.close();
    }
  });
}
