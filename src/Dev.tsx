import { CircuitPythonShell } from "./CircuitPythonShell";
import Editor from "./Editor";
import type { Code } from "./useLesson";

export function Dev({ editorContent }: { editorContent?: Code }) {
  return (
    <div className="grid grid-rows-[100fr_62fr]">
      <Editor content={editorContent} />
      <CircuitPythonShell />
    </div>
  );
}
