export function Sidebar() {
  return (
    <aside className="bg-ctp-mantle h-screen p-4 flex flex-col gap-4 border-r-2 border-ctp-crust justify-end">
      <button className="w-14 h-14 bg-ctp-surface0 rounded-lg">?</button>
      <button className="w-14 h-14 bg-ctp-surface0 rounded-lg">&lt;</button>
      <button className="w-14 h-14 bg-ctp-surface0 rounded-lg">&gt;</button>
    </aside>
  );
}
