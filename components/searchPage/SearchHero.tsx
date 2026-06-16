"use client";

import { SearchBar } from "../search/SearchBar";

interface Props {
  query: string;
}

export default function SearchHero({ query }: Props) {
  return (
    <section
      className="
        relative
        overflow-visible
        border-b
        bg-gradient-to-b
        from-amber-50
        via-background
        to-background
        z-999
      "
    >
      {/* Background Blobs */}
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl sm:h-72 sm:w-72" />

      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14 lg:py-20">
        <h1
          className="
            text-center
            text-3xl
            font-bold
            tracking-tight
            break-words

            sm:text-4xl
            lg:text-5xl
          "
        >
          Search Results
          {query && (
            <>
              <span className="block mt-2 text-amber-500">
                "{query}"
              </span>
            </>
          )}
        </h1>

        <p
          className="
            mx-auto
            mt-4
            max-w-2xl
            text-center
            text-sm
            text-muted-foreground

            sm:text-base
          "
        >
          Discover institutes, categories, cities and resources.
        </p>

        <div
          className="
            mt-8
            rounded-3xl
            border
            border-amber-100
            bg-white/95
            p-2
            shadow-[0_20px_60px_rgba(251,191,36,0.15)]
            backdrop-blur-sm

            sm:p-4
          "
        >
          <SearchBar />
        </div>
      </div>
    </section>
  );
}