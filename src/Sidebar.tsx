import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "./components/ui/button";

export function Sidebar() {
  return (
    <aside className="bg-ctp-mantle h-screen p-4 flex flex-col gap-4 border-r-2 border-ctp-crust justify-end">
      <Button icon={HelpCircle} variant={"accent"} />
      <Button icon={ChevronLeft} />
      <Button icon={ChevronRight} />
    </aside>
  );
}
