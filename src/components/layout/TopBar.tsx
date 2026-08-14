import { Search, Bell } from "lucide-react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-neutral-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-400 sm:flex">
          <Search size={15} />
          <span>Search customers, vehicles, jobs...</span>
        </div>
        <button className="rounded-lg border border-neutral-200 p-2 text-neutral-500 hover:bg-neutral-50">
          <Bell size={16} />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
          GA
        </div>
      </div>
    </header>
  );
}
