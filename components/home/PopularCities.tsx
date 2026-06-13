import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const cities = [
  {
    name: "Noida",
    institutes: "6000+ Institutes",
    href: "/categories?city=noida",
  },
  {
    name: "Delhi",
    institutes: "3000+ Institutes",
    href: "/categories?city=delhi",
  },
//   {
//     name: "Jaipur",
//     institutes: "700+ Institutes",
//     href: "/city/jaipur",
//   },
//   {
//     name: "Bangalore",
//     institutes: "650+ Institutes",
//     href: "/city/bangalore",
//   },
//   {
//     name: "Hyderabad",
//     institutes: "620+ Institutes",
//     href: "/city/hyderabad",
//   },
//   {
//     name: "Pune",
//     institutes: "550+ Institutes",
//     href: "/city/pune",
//   },
 ];

export function PopularCities() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-medium text-amber-500">
              Explore Cities
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Popular Coaching Cities
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Discover coaching institutes across India's most popular
              education hubs.
            </p>
          </div>

          <Link
            href="/cities"
            className="
              hidden
              items-center
              gap-2
              font-medium
              transition-colors
              hover:text-amber-500
              md:flex
            "
          >
            View All Cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={city.href}
              className="
                group
                rounded-2xl
                border
                bg-background
                p-4
                sm:p-5
                transition-all
                duration-300
                md:hover:-translate-y-1
                md:hover:border-amber-200
                md:hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-amber-50
                      "
                    >
                      <MapPin className="h-5 w-5 text-amber-500" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {city.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {city.institutes}
                      </p>
                    </div>
                  </div>
                </div>

                <ArrowRight
                  className="
                    mt-2
                    h-4
                    w-4
                    text-muted-foreground
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-amber-500
                  "
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/cities"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              px-4
              py-3
              font-medium
              transition-colors
              hover:bg-amber-50
            "
          >
            View All Cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}