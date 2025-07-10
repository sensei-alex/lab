import { useEffect, useState } from "react";
import { useXTerm } from "react-xtermjs";
import { FitAddon } from "@xterm/addon-fit";

export function CircuitPythonShell({ ip }: { ip: string }) {
  const [addons] = useState([new FitAddon()]);
  const { instance, ref } = useXTerm({ addons });

  function reconnect() {
    const conn = new WebSocket("ws://:hunter2@" + ip + "/cp/serial/");
    conn.onopen = () => {
      console.log("terminal connection established");
    };
    conn.onclose = () => {
      console.log("terminal connection closed, re-establishing");
      reconnect();
    };

    conn.onmessage = ({ data }) => {
      setTimeout(() => addons[0].fit(), 0);
      instance?.write(data);
    };

    if (instance) {
      instance.onData((data) => {
        console.log("sending", data);
        conn.send(data);
      });

      instance.options.fontFamily = '"JetBrains Mono", monospace';
      instance.options.fontSize = 16;
      instance.options.letterSpacing = 0; // thanks https://github.com/xtermjs/xterm.js/issues/2963#issuecomment-812031516
      instance.options.theme = {
        background: "#181825",
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
      };

      setTimeout(() => addons[0].fit(), 0);
    }

    return () => {
      conn.onclose = () => {};
      conn.close();
    };
  }

  useEffect(reconnect, [instance, ip]);

  return (
    <div
      ref={ref}
      className="w-full h-full grid place-content-center bg-ctp-mantle border-ctp-crust border-t-2"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "38svh",
      }}
    ></div>
  );
}
