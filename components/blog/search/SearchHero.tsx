"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import SearchSuggestions, {
  SearchSuggestion,
} from "./SearchSuggestions";

type SearchHeroProps = {
  initialQuery?: string;
  totalResults?: number;
};

export default function SearchHero({
  initialQuery = "",
  totalResults = 0,
}: SearchHeroProps) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);

  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `/api/blog/search/suggestions?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        setSelectedIndex(-1);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    setShowSuggestions(false);

    router.push(`/blog/search?${params.toString()}`);
  }

  function handleKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>
) {
  if (!showSuggestions || suggestions.length === 0) {
    return;
  }

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev >= suggestions.length - 1 ? 0 : prev + 1
      );

      break;

    case "ArrowUp":
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );

      break;

    case "Escape":
      setShowSuggestions(false);
      setSelectedIndex(-1);
      break;

    case "Enter":
      if (selectedIndex >= 0) {
        e.preventDefault();

        router.push(suggestions[selectedIndex].url);

        setShowSuggestions(false);
        setSelectedIndex(-1);
      }

      break;
  }
}

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 shadow-sm md:p-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl font-serif">
          Search Blog
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Search articles, tutorials, preparation guides and expert insights.
        </p>

        <div
          ref={containerRef}
          className="relative mt-8"
        >
          <form
            onSubmit={handleSubmit}
            className="flex overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-white shadow-[0_8px_30px_rgb(245,158,11,0.15)] ring-4 ring-amber-500/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(245,158,11,0.2)] hover:border-amber-500/50 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20"
          >
            <div className="flex items-center px-5 text-slate-400 group-focus-within:text-amber-500">
              <Search className="h-5 w-5" />
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Search blog articles..."
              className="flex-1 bg-transparent px-2 py-4 text-lg outline-none"
            />

            <button
              type="submit"
              className="bg-amber-400 px-8 font-semibold text-slate-900 transition hover:bg-amber-500"
            >
              Search
            </button>
          </form>

          {showSuggestions && (
            <SearchSuggestions
              suggestions={suggestions}
              loading={loading}
              selectedIndex={selectedIndex}
              onSelect={() => setShowSuggestions(false)}
            />
          )}
        </div>

        {initialQuery && (
          <p className="mt-5 text-sm text-slate-500">
            {totalResults.toLocaleString()} result
            {totalResults !== 1 && "s"} found for{" "}
            <span className="font-semibold text-slate-700">
              "{initialQuery}"
            </span>
          </p>
        )}
      </div>
    </section>
  );
}