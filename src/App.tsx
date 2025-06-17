import { CheckIcon } from "lucide-react";
import { CircuitPythonShell } from "./CircuitPythonShell";
import { Button } from "./components/ui/button";
import Editor from "./Editor";
import { Prose } from "./Prose";
import { Sidebar } from "./Sidebar";

function App() {
  return (
    <div className="bg-ctp-base h-screen w-screen mocha text-ctp-text grid grid-cols-[auto_70ch_1fr]">
      <Sidebar />
      <Prose />
      <div>
        <Button icon={CheckIcon} variant={"safe"}>
          Hello world
        </Button>
        <Editor />
        <CircuitPythonShell />
      </div>
    </div>
  );
}

export default App;
