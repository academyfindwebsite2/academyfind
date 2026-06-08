import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

const destinations = [
  {
    title: "JEE Coaching in Noida",
    subtitle: "700+ Institutes",
    href: "/jee-coaching/noida",
  },
  {
    title: "NEET Coaching in Noida",
    subtitle: "850+ Institutes",
    href: "/neet-coaching/noida",
  },
  {
    title: "UPSC Coaching in Noida",
    subtitle: "300+ Institutes",
    href: "/upsc-coaching/noida",
  },
  {
    title: "CAT Coaching in Noida",
    subtitle: "450+ Institutes",
    href: "/cat-coaching/noida",
  },
  {
    title: "SSC Coaching in Noida",
    subtitle: "600+ Institutes",
    href: "/ssc-coaching/Noida",
  },
];

const categories = [
  "JEE",
  "NEET",
  "UPSC",
  "SSC",
  "CAT",
  "CLAT",
  "Banking",
  "CUET",
];

export function TrendingDestinations() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-medium text-amber-500">
              Trending Searches
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              What Students Are Searching
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Discover the most searched coaching destinations across India.
            </p>
          </div>

          <Link
            href="/search"
            className="hidden items-center gap-2 font-medium transition-colors hover:text-amber-500 md:flex"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {destinations.map((item, index) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="
                    group
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    bg-background
                    p-4
                    transition-all
                    hover:border-amber-200
                    hover:shadow-md
                    sm:p-5
                  "
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-amber-50
                        text-sm
                        font-semibold
                        text-amber-500
                      "
                    >
                      #{index + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium sm:text-base">
                        {item.title}
                      </h3>

                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-muted-foreground
                      transition-all
                      group-hover:translate-x-1
                      group-hover:text-amber-500
                    "
                  />
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <Link
              href="/search"
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                p-3
                font-medium
                transition-colors
                hover:bg-amber-50
                md:hidden
              "
            >
              View All Searches
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />

                <h3 className="font-semibold">
                  Popular Categories
                </h3>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Explore coaching categories students search the most.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/search?q=${category}`}
                    className="
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      transition-all
                      hover:border-amber-200
                      hover:bg-amber-50
                      sm:px-4
                      sm:py-2
                      sm:text-sm
                    "
                  >
                    {category}
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-amber-50 p-4">
                <p className="text-sm font-medium">
                  🔥 Most Searched This Week
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  JEE Coaching in Kota and NEET Coaching in Delhi are trending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}