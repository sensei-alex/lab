import { CircuitPythonShell } from "./CircuitPythonShell";
import Editor from "./Editor";

export function Dev({ editorContent }: { editorContent?: string }) {
  return (
    <div>
      <Editor content={editorContent} />
      <CircuitPythonShell />
    </div>
  );
}
