import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cities = [
  "kota",
  "delhi",
  "jaipur",
  "hyderabad",
];

export default function RelatedCities({
  category,
}: {
  category: string;
}) {
  return (
    <section className="mt-20">
      <div className="mb-8">
        <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
          Explore More Cities
        </span>

        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
          Popular Cities for {category}
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          Discover top institutes in other major cities and
          compare opportunities across India.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cities.map((city) => (
          <Link
            key={city}
            href={`/${category}/${city}`}
            className="
              group
              rounded-2xl
              border
              border-amber-100
              bg-white
              p-5
              transition-all
              duration-200
              hover:-translate-y-1
              hover:border-amber-300
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900 capitalize">
                  {city}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Explore institutes
                </p>
              </div>

              <ArrowRight className="h-5 w-5 text-amber-500 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}