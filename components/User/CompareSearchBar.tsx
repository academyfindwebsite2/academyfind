'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search, X, ArrowRightLeft, Loader2 } from 'lucide-react';
import { goToComparison } from '@/lib/User/user/compare-institute';

type Hit = {
  id: string;
  name: string;
  city?: string;
  logo?: string;
  averageRating?: number;
  googleRating?: number;
};

function InstitutePicker({
  placeholder,
  selected,
  onSelect,
  onClear,
}: {
  placeholder: string;
  selected: Hit | null;
  onSelect: (hit: Hit) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/institutes/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.hits || []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // ✅ FIX: Added w-full to the selected state container
  if (selected) {
    return (
      <div className="flex w-full h-[52px] items-center justify-between gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 px-4">
        <span className="truncate text-sm font-semibold text-stone-800">{selected.name}</span>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-full p-1 text-stone-400 transition hover:bg-amber-100 hover:text-stone-600"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ✅ FIX: Added w-full to the default state container
  return (
    <div className="relative w-full">
      <div className="flex h-[52px] items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 transition focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100">
        <Search className="h-4 w-4 shrink-0 text-stone-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-400" />}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
          {!loading && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-stone-400">No institutes found for &ldquo;{query}&rdquo;</p>
          )}
          <ul className="max-h-72 overflow-y-auto">
            {results.map((hit: any) => {
              const rating = hit.googleRating ?? hit.averageRating;
              return (
                <li key={hit.id}>
                  <button
                    type="button"
                    onMouseDown={() => {
                      onSelect(hit);
                      setQuery('');
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-amber-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-stone-800">{hit.name}</span>
                      {hit.city && <span className="block text-xs text-stone-400">{hit.city}</span>}
                    </span>
                    {rating ? (
                      <span className="shrink-0 text-xs font-bold text-amber-600">⭐ {rating.toFixed(1)}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CompareSearchBar() {
  const [instA, setInstA] = useState<Hit | null>(null);
  const [instB, setInstB] = useState<Hit | null>(null);
  const [isPending, startTransition] = useTransition();

  const sameInstitute = !!instA && !!instB && instA.id === instB.id;
  const canCompare = !!instA && !!instB && !sameInstitute;

  function handleCompare() {
    if (!instA || !instB || !canCompare) return;
    startTransition(async () => {
      const result = await goToComparison(instA.id, instB.id);
      
      // Agar backend ne error bheja hai, toh browser me Alert dikhao
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    // ✅ FIX: Increased max-w-2xl to max-w-3xl for better breathing room
    <div className="mx-auto mt-8 w-full max-w-3xl">
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        
        {/* ✅ FIX: Wrapped in w-full min-w-0 to prevent layout blowout */}
        <div className="w-full min-w-0">
          <InstitutePicker
            placeholder="Search first institute…"
            selected={instA}
            onSelect={setInstA}
            onClear={() => setInstA(null)}
          />
        </div>

        <div className="flex justify-center">
          <ArrowRightLeft className="h-5 w-5 shrink-0 rotate-90 text-amber-400 sm:rotate-0" />
        </div>

        {/* ✅ FIX: Wrapped in w-full min-w-0 */}
        <div className="w-full min-w-0">
          <InstitutePicker
            placeholder="Search second institute…"
            selected={instB}
            onSelect={setInstB}
            onClear={() => setInstB(null)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCompare}
        disabled={!canCompare || isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-bold text-white shadow-lg shadow-amber-200/60 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Loading comparison…
          </>
        ) : (
          'Compare Now'
        )}
      </button>

      {sameInstitute && (
        <p className="mt-2 text-center text-xs font-medium text-rose-500">
          Pick two different institutes to compare.
        </p>
      )}
    </div>
  );
}