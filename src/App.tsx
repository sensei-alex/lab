import { useState } from "react";
import { Dev } from "./Dev";
import { Prose } from "./Prose";
import { Sidebar } from "./Sidebar";
import { useLesson } from "./useLesson";
import { Loader } from "lucide-react";

function App() {
  const { lesson, next, prev } = useLesson();
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
    <div
      className="bg-ctp-base h-svh w-screen mocha text-ctp-text grid grid-cols-[auto_75ch_1fr]"
      translate="no"
    >
      <Sidebar
        helpBeingShown={showSolution}
        onNext={lesson.next ? hideSolutionAnd(next) : undefined}
        onPrev={lesson.prev ? hideSolutionAnd(prev) : undefined}
        onHelp={toggleSolution}
      />
      {lesson.runner === "none" ? (
        <div className="col-span-2">
          <div className="w-[75ch] m-auto">
            <Prose content={lesson.body} />
          </div>
        </div>
      ) : (
        <>
          <Prose content={lesson.body} />
          <Dev editorContent={showSolution ? lesson.solution : undefined} />
        </>
      )}
    </div>
  );
}

export default App;
