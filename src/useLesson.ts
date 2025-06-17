import { useEffect, useState } from "react";
import YAML from 'yaml'

const LESSONS_URL = "https://snlx.net/lab-src/lab-"

export type Lesson = {
  lang: string,
  lesson: string,
  solution?: string,
  prev?: string,
  next?: string,
}

export function useLesson(initialLessonId: string) {
  const [lessonId, setLessonId] = useState(initialLessonId);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const controller = new AbortController()

    getLesson(LESSONS_URL + lessonId + ".md", controller.signal)
    .then(setLesson)

    return () => controller.abort()
  }, [LESSONS_URL, lessonId])

  function next() {
    //todo
  }

  function prev() {
    //todo
  }

  return {lesson, setLessonId, next, prev}
}

async function getLesson(url: string, signal: AbortSignal): Promise<Lesson> {
  const response = await fetch(url, {signal});
  const markdown = await response.text()

  const [frontmatter, lesson, solution] = markdown.split("\n---\n");

  const {lang, next, prev} = YAML.parse(frontmatter)

  return {
    lang: lang || "en",
    next: next.replace(/["\[\]]/g, ""),
    prev: prev.replace(/["\[\]]/g, ""),
    lesson,
    solution
  }
}
