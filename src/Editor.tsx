import { catppuccinMocha } from "@catppuccin/codemirror";
import { python } from "@codemirror/lang-python";
import ReactCodeMirror, { drawSelection } from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { vim } from "@replit/codemirror-vim";
import type { Code } from "./useLesson";

export default function Editor({
  content,
}: {
  content?: Code;
  onUpdate?: (data: string) => void;
}) {
  const [value, setValue] = useState(content?.body);

  useEffect(() => {
    setValue(content?.body);
  }, [content]);

  return (
    <ReactCodeMirror
      value={value}
      extensions={[drawSelection(), python(), vim()]}
      onChange={setValue}
      theme={catppuccinMocha}
      height="62vh"
      autoFocus={true}
    />
  );
}
