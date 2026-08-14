import { Search, Bell } from "lucide-react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 sm:flex">
          <Search size={15} />
          <span>Search customers, vehicles, jobs...</span>
        </div>
        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-accent-500/40 hover:bg-accent-50 hover:text-accent-600">
          <Bell size={16} />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-semibold text-white">
          GA
        </div>
      </div>
    </header>
  );
}
