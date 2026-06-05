import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SearchBar } from "@/components/search/SearchBar";

const trendingSearches = [
  {
    title:"Dance Classes in Delhi",
    slug: "dance-classes/delhi"
  },
  {
    title:"JEE Coaching in Noida",
    slug:"jee-coaching/noida",
  },
  {
    title:"NEET Coaching in Noida",
    slug:"neet-coaching/noida"
  },
  {
    title:"CLAT Coaching in Noida",
    slug:"clat-coaching/noida"
  
  }
  
  
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-linear-to-b from-amber-50 via-background to-background">
      {/* Background Glow */}
      <div
        className="
          absolute
          left-1/2
          top-10
          -z-10
          h-64
          w-64
          -translate-x-1/2
          rounded-full
          bg-amber-200/20
          blur-3xl

          sm:h-96
          sm:w-96
        "
      />

      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          {/* Badge */}
          <div
            className="
              mb-3
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
          <h1
            className="
              font-extrabold
              tracking-tight
              leading-[1.05]
              text-[clamp(1.9rem,4.5vw,4.25rem)]
            "
          >
            Find the Right
            <span className="block text-amber-400">
              Coaching Institute
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mt-3
              max-w-xl
              text-xs
              text-muted-foreground

              sm:text-sm
              lg:text-base
            "
          >
            Compare coaching institutes, explore cities,
            read reviews and discover the best place
            for your preparation journey.
          </p>

          {/* Search Label */}
          <p
            className="
              mt-6
              mb-3
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
                bg-linear-to-r
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
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              🔥 Trending Today
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((item) => (
                <Link
                  key={item.slug}
                  href={item.slug}
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
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/categories"
            className="
              mt-5
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