import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SearchBar } from "@/components/search/SearchBar";

const trendingSearches = [
  "Allen vs Motion",
  "JEE Coaching in Kota",
  "UPSC Coaching in Delhi",
  "NEET Coaching in Jaipur",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-amber-50 via-background to-background">
      {/* Background Glow */}
      <div
        className="
          absolute
          left-1/2
          top-20
          -z-10
          h-[300px]
          w-[300px]
          -translate-x-1/2
          rounded-full
          bg-amber-200/20
          blur-3xl

          sm:h-[450px]
          sm:w-[450px]
        "
      />

      <div className="container mx-auto px-4 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          {/* Badge */}
          <div
            className="
              mb-5
              rounded-full
              border
              bg-white/80
              px-4
              py-2
              text-xs
              font-medium
              shadow-sm
              backdrop-blur
            "
          >
            India's Coaching Discovery Platform
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Find the Right
            <span className="block text-amber-500">
              Coaching Institute
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Compare coaching institutes, explore cities,
            read reviews and discover the best place
            for your preparation journey.
          </p>

          {/* Search Label */}
<p
  className="
    mt-10
    mb-4
    text-xs
    font-semibold
    uppercase
    tracking-[0.2em]
    text-amber-500
    sm:text-sm
  "
>
  Search by Exam, Institute or City
</p>

{/* Search */}
<div className="relative w-full max-w-4xl">
  {/* Outer Glow */}
  <div
    className="
      pointer-events-none
      absolute
      inset-0
      -z-10
      scale-110
      rounded-[2rem]
      bg-gradient-to-r
      from-amber-300/25
      via-yellow-200/25
      to-amber-300/25
      blur-3xl
    "
  />

  {/* Secondary Glow */}
  <div
    className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      -z-10
      h-32
      w-[80%]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-amber-400/10
      blur-3xl
    "
  />

  {/* Search Card */}
  <div
    className="
      relative
      rounded-[2rem]
      border
      border-amber-100
      bg-white/95
      p-3
      shadow-[0_20px_60px_rgba(251,191,36,0.15)]
      backdrop-blur-sm

      sm:p-4
    "
  >
    <SearchBar />
  </div>
</div>

          {/* Trending */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              🔥 Trending Today
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="
                    rounded-full
                    border
                    bg-background
                    px-4
                    py-2
                    text-sm
                    transition-all
                    hover:border-amber-200
                    hover:bg-amber-50
                  "
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/categories"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              font-medium
              text-amber-500
              transition-colors
              hover:text-amber-600
            "
          >
            Browse All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}