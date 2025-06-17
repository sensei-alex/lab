import { CircuitPythonShell } from "./CircuitPythonShell";
import Editor from "./Editor";
import { Prose } from "./Prose";
import { Sidebar } from "./Sidebar";
import { useLesson } from "./useLesson";

function App() {
  const lesson = useLesson("mockup");

  return (
    <div className="bg-ctp-base h-screen w-screen mocha text-ctp-text grid grid-cols-[auto_70ch_1fr]">
      <Sidebar />
      <Prose />
      <div>
        <Editor />
        <CircuitPythonShell />
      </div>
    </div>
  );
}

export default App;
