import { useEffect, useState } from "react";
import { scanWifi } from "./scanWifi";

export type CircuitpyBoard = {
  url: string;
};

export function useCircuitpy(props: {
  ip?: string;
  print: (message: string) => void;
}) {
  const [ip, setIp] = useState<string>();

  useEffect(() => {
    if (props.ip) {
      setIp(props.ip);
      return;
    }

    function notify(message: string) {
      props.print("Connecting: " + message.toLocaleLowerCase());
    }

    findCircuitpyDevice(notify).then(setIp);
  }, [props.ip]);

  return ip;
}

async function findCircuitpyDevice(
  notify: (message: string) => void,
): Promise<string> {
  const devices = await scanWifi(notify);
  const board = devices.find(({ type }) => type === "circuitpy");

  if (board) {
    return board.ip;
  }

  notify("Retrying...");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return findCircuitpyDevice(notify);
}
