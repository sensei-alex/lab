export default function Editor({
  content,
}: {
  content?: string;
  onUpdate?: (data: string) => void;
}) {
  return <pre>{content || "(empty)"}</pre>;
}
