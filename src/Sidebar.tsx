import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "./components/ui/button";

export function Sidebar({
  helpBeingShown,
  onHelp,
  onPrev,
  onNext,
}: {
  helpBeingShown: boolean;
  onHelp: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <aside className="bg-ctp-mantle h-screen p-4 flex flex-col gap-4 border-r-2 border-ctp-crust justify-end">
      <Button
        onClick={onHelp}
        icon={HelpCircle}
        variant={helpBeingShown ? "accent" : "default"}
      />
      <Button onClick={onPrev} icon={ChevronLeft} />
      <Button onClick={onNext} icon={ChevronRight} />
    </aside>
  );
}
