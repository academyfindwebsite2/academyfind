import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

const cityGradients: Record<string, string> = {
  kota: "from-orange-400 to-amber-500",
  delhi: "from-blue-500 to-cyan-500",
  noida: "from-violet-500 to-fuchsia-500",
  jaipur: "from-pink-500 to-rose-500",
  lucknow: "from-green-500 to-emerald-500",
  hyderabad: "from-indigo-500 to-blue-600",
  mumbai: "from-cyan-500 to-blue-500",
  bangalore: "from-emerald-500 to-teal-500",
  pune: "from-rose-500 to-red-500",
};

export default async function ExploreByCity() {
  // Query top 6 cities sorted by active institutes
  const dbCities = await prisma.city.findMany({
    take: 6,
    select: {
      name: true,
      slug: true,
      _count: {
        select: {
          institutes: true,
        },
      },
    },
    orderBy: {
      institutes: {
        _count: "desc",
      },
    },
  });

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14">
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Browse Cities
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900">
            Find Coaching Near You
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Explore coaching institutes, reviews, blogs and admission
            guides from India's most popular education hubs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dbCities.map((city) => {
            const gradient = cityGradients[city.slug.toLowerCase()] || "from-slate-500 to-slate-600";
            return (
              <Link
                key={city.slug}
                prefetch={false}
                href={`/categories?city=${city.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition duration-500 group-hover:opacity-5`}
                />

                <div className="relative">
                  <div className="inline-flex rounded-2xl bg-amber-50 p-4 text-amber-500">
                    <MapPin className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-3xl font-bold text-slate-900 transition group-hover:text-amber-600">
                    {city.name}
                  </h3>

                  <p className="mt-3 text-slate-600 font-semibold">
                    {city._count.institutes}+ Institutes
                  </p>

                  <div className="mt-8 inline-flex items-center gap-2 font-semibold text-amber-600">
                    Explore City
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/cities"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 hover:shadow-lg"
          >
            View All Cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}