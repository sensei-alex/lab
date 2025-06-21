import { Loader } from "lucide-react";

export function CircuitPythonShell({
  value,
}: {
  value?: string;
  onInput?: (char: string) => void;
}) {
  if (!value) {
    return (
      <div className="w-full h-full grid place-content-center bg-ctp-mantle">
        <Loader className="animate-spin" />
      </div>
    );
  }
  return <pre>{value}</pre>;
}
