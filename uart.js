const ESPRESSIF_VENDOR_ID = 0x303a;
const RASPBERRY_VENDOR_ID = 0x2e8a;

const ENTER_KEY = String.fromCharCode(13);
const CONTROL_D = String.fromCharCode(4);

async function pickSerialPort() {
  if (!("serial" in navigator)) {
    alert(
      "Please use a chromium-based browser (e.g., brave, edge, vidaldi, chrome, etc.)",
    );
    return;
  }

  const port = await navigator.serial
    .requestPort({
      filters: [
        { usbVendorId: ESPRESSIF_VENDOR_ID },
        { usbVendorId: RASPBERRY_VENDOR_ID },
      ],
    })
    .catch(() => null);

  if (!port) {
    console.log("Port selection cancelled");
    return;
  }

  return port;
}

async function configureUartConnection() {
  const port = await pickSerialPort();

  await port.open({ baudRate: 115200 });

  const encoder = new TextEncoderStream();
  const writer = encoder.writable.getWriter();
  encoder.readable.pipeTo(port.writable);

  const textDecoder = new TextDecoderStream();
  const _readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  let externalReaders = [];
  const onData = (reader) => externalReaders.push(reader);
  const write = (char) => writer.write(char);

  startListening();

  async function startListening() {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        reader.releaseLock();
        break;
      }

      externalReaders.forEach((reader) => reader(value));
    }
  }

  return { write, onData };
}
