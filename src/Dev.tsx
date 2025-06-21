import { CircuitPythonShell } from "./CircuitPythonShell";
import Editor from "./Editor";
import type { Code } from "./useLesson";

export function Dev({ editorContent }: { editorContent?: Code }) {
  return (
    <div>
      <Editor content={editorContent} />
      <CircuitPythonShell />
    </div>
  );
}
