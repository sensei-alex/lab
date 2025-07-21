import { useEffect, useState } from "react";
import { scanWifi } from "./scanWifi";
import type { Code } from "./useLesson";

export type CircuitpyBoard = {
  ip?: string;
  code: Code;
  saveCode(contents: Code): Promise<void>;
};

export function useCircuitpy(props: {
  ip?: string;
  print: (message: string) => void;
}): CircuitpyBoard {
  const [ip, setIp] = useState<string>();
  const [code, setCode] = useState<string>("");

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

  useEffect(() => {
    if (!ip) {
      return;
    }

    loadCodeFrom(ip).then(setCode);
  }, [ip]);

  async function saveCode({ body }: Code) {
    await fetch("http://" + ip + "/fs/code.py", {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(":hunter2"),
      },
      body,
    });
  }

  return {
    ip,
    code: {
      language: "python",
      body: code,
    },
    saveCode,
  };
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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return findCircuitpyDevice(notify);
}

async function loadCodeFrom(ip: string) {
  const response = await fetch("http://" + ip + "/fs/code.py", {
    headers: {
      Authorization: "Basic " + btoa(":hunter2"),
    },
  });

  return response.text();
}
