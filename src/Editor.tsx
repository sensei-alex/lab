import { catppuccinMocha } from "@catppuccin/codemirror";
import { python } from "@codemirror/lang-python";
import ReactCodeMirror, { drawSelection } from "@uiw/react-codemirror";
import { useEffect, useRef, useState } from "react";
import { Vim, vim } from "@replit/codemirror-vim";
import type { Code } from "./useLesson";

export default function Editor({
  content,
  onUpdate,
}: {
  content?: Code;
  onUpdate?: (data: Code) => void;
}) {
  const [value, setValue] = useState(content?.body);
  const onUpdateRef = useRef(() => {});

  useEffect(() => {
    onUpdateRef.current = () =>
      onUpdate?.({
        body: value || "",
        language: content?.language || "plaintext",
      });
  }, [value, onUpdate]);

  Vim.defineEx("write", "w", () => {
    onUpdateRef.current();
  });

  useEffect(() => {
    setValue(content?.body);
  }, [content]);

  return (
    <ReactCodeMirror
      value={value}
      extensions={[drawSelection(), python(), vim()]}
      basicSetup={{ autocompletion: false }}
      onChange={setValue}
      theme={catppuccinMocha}
      height="62vh"
      autoFocus={true}
    />
  );
}
