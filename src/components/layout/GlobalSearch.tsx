"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Loader2, Mail, MapPin, Search } from "lucide-react";
import { searchCustomers, type CustomerSearchResult } from "@/lib/supabase/search";

interface SearchState {
  term: string;
  items: CustomerSearchResult[];
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const currentTerm = query.trim();
  // Only trust searchState when it matches the query currently on screen —
  // this discards results from a previous, now-superseded query instead of
  // showing them (and letting a click or Enter navigate to them) during the
  // debounce window of a new one.
  const isCurrent = searchState !== null && searchState.term === currentTerm;
  const results = isCurrent ? searchState.items : [];
  const searched = isCurrent;

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    const id = ++requestId.current;
    const timeout = setTimeout(() => {
      setLoading(true);
      searchCustomers(term)
        .then((found) => {
          if (requestId.current === id) setSearchState({ term, items: found });
        })
        .catch(() => {
          if (requestId.current === id) setSearchState({ term, items: [] });
        })
        .finally(() => {
          if (requestId.current === id) setLoading(false);
        });
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  function goTo(id: string) {
    setOpen(false);
    setQuery("");
    setSearchState(null);
    router.push(`/customers/${id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && results.length > 0) {
      goTo(results[0].id);
    }
  }

  const showPanel = open && query.trim().length >= 2;

  return (
    <div className="relative hidden lg:block">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 focus-within:border-accent-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-accent-500/10">
        <Search size={15} className="shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search customers, vehicles, jobs..."
          className="w-56 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        {loading && query.trim().length >= 2 ? (
          <Loader2 size={14} className="shrink-0 animate-spin text-slate-400" />
        ) : null}
      </div>

      {showPanel ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-950/10">
            {results.length > 0 ? (
              results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(r.id)}
                  className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-slate-900">{r.name}</span>
                    {r.matchedVehicle ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-medium text-accent-700">
                        <Car size={11} /> {r.matchedVehicle}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-slate-400">
                    {r.email ? (
                      <span className="flex items-center gap-1 truncate">
                        <Mail size={11} /> {r.email}
                      </span>
                    ) : null}
                    {r.city ? (
                      <span className="flex shrink-0 items-center gap-1">
                        <MapPin size={11} /> {r.city}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))
            ) : searched && !loading ? (
              <p className="px-3 py-4 text-center text-sm text-slate-400">
                No customers found for &ldquo;{query.trim()}&rdquo;.
              </p>
            ) : (
              <p className="px-3 py-4 text-center text-sm text-slate-400">
                Keep typing to search...
              </p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
