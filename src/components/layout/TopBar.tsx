"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useNavDrawer } from "./NavDrawerContext";
import { UserMenu } from "./UserMenu";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { open } = useNavDrawer();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={open}
          aria-label="Open menu"
          className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 md:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 lg:flex">
          <Search size={15} />
          <span>Search customers, vehicles, jobs...</span>
        </div>
        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-accent-500/40 hover:bg-accent-50 hover:text-accent-600">
          <Bell size={16} />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
