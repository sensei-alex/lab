import Markdown from "react-markdown";
import { Image } from "./Card";

export function Prose({ content }: { content: string }) {
  return (
    <article className="p-6 prose overflow-auto border-ctp-crust border-r-2">
      <Markdown components={{ img: Image }}>{content}</Markdown>
    </article>
  );
}
