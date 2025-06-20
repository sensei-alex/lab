import { useEffect, useMemo, useState } from "react";
import { Dev } from "./Dev";
import { Prose } from "./Prose";
import { Sidebar } from "./Sidebar";
import { useLesson } from "./useLesson";
import { Loader } from "lucide-react";

function App() {
  const { lesson, next, prev } = useLesson("lab-mockup");
  const [showSolution, setShowSolution] = useState(false);

  function toggleSolution() {
    setShowSolution(!showSolution);
  }

  function hideSolutionAnd(andThen: Function) {
    return () => {
      setShowSolution(false);
      andThen();
    };
  }

  if (!lesson) {
    return (
      <div className="bg-ctp-base h-screen w-screen mocha text-ctp-text grid place-items-center">
        <Loader size={64} />
      </div>
    );
  }

  return (
    <div className="bg-ctp-base h-screen w-screen mocha text-ctp-text grid grid-cols-[auto_70ch_1fr]">
      <Sidebar
        onNext={hideSolutionAnd(next)}
        onPrev={hideSolutionAnd(prev)}
        onHelp={toggleSolution}
      />
      <Prose content={lesson.body} />
      <Dev editorContent={showSolution ? lesson.solution : undefined} />
    </div>
  );
}

export default App;
