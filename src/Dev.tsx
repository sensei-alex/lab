import { useState } from "react";
import { CircuitPythonShell } from "./CircuitPythonShell";
import Editor from "./Editor";
import { useCircuitpy } from "./useCircuitpy";
import type { Code } from "./useLesson";

export function Dev({ editorContent }: { editorContent?: Code }) {
  const [log, setLog] = useState<string>();
  const board = useCircuitpy({ print: setLog });

  return (
    <div className="grid grid-rows-[100fr_62fr] h-svh">
      <Editor content={editorContent || board.code} />
      <CircuitPythonShell value={log} />
    </div>
  );
}
