import { useEffect, useState } from "react";
import YAML from "yaml";

const BASE_URL = "https://snlx.net/lab-src/";

export type Code = {
  language: string;
  body: string;
};

export type Lesson = {
  lang: string;
  body: string;
  solution?: Code;
  prev?: string;
  next?: string;
};

export function useLesson(initialLessonId: string) {
  const [lessonId, setLessonId] = useState(initialLessonId);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    console.log("refetching");
    const controller = new AbortController();

    getLesson(BASE_URL + lessonId + ".md", controller.signal).then(setLesson);

    return () => controller.abort();
  }, [BASE_URL, lessonId]);

  useEffect(() => console.log(lessonId, lesson), [lessonId, lesson]);

  function next() {
    if (!lesson?.next) return;

    setLessonId(lesson.next);
  }

  function prev() {
    if (!lesson?.prev) return;

    setLessonId(lesson.prev);
  }

  return { lesson, setLessonId, next, prev };
}

async function getLesson(url: string, signal: AbortSignal): Promise<Lesson> {
  const response = await fetch(url, { signal });
  const markdown = await response.text();

  const [frontmatter, body, rawSolution] = markdown.split("\n---\n");

  const { lang, next, prev } = YAML.parse(frontmatter);

  const solutionLines = rawSolution?.trim().split("\n");
  const solution: Code | undefined = rawSolution
    ? {
        language: solutionLines[0].slice(3),
        body: solutionLines.slice(1, -1).join("\n"),
      }
    : undefined;

  return {
    lang: lang || "en",
    next: next?.replace(/["\[\]]/g, ""),
    prev: prev?.replace(/["\[\]]/g, ""),
    body,
    solution,
  };
}
