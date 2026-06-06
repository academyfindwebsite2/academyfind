import { Building2, ShieldCheck, Star } from "lucide-react";

export default function CategoryHero({
  category,
  totalCount,
}: {
  category: any;
  totalCount: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 via-white to-orange-50 p-8 md:p-12 mb-12">
      
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative">
        {/* <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-4 py-1 text-sm font-medium text-amber-400">
          📍 {cityName}
        </div> */}

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
          Best Instittutes for
          <br />
          {category.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Compare fees, ratings, reviews, faculty and courses
          from the highest-rated institutes for {category.name}.
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
          {/* Stat 1: Total Institutes (Dynamic) */}
          <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 backdrop-blur">
            <Building2 className="h-5 w-5 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalCount}
            </p>
            <p className="text-sm text-slate-500">
              Institutes
            </p>
          </div>

          {/* Stat 2: Verified Data (Logical Replacement) */}
          <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-slate-900">
              100%
            </p>
            <p className="text-sm text-slate-500">
              Verified Data
            </p>
          </div>

          {/* Stat 3: Top Rated (Based on DB Sorting) */}
          <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 backdrop-blur">
            <Star className="h-5 w-5 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-slate-900">
              Top
            </p>
            <p className="text-sm text-slate-500">
              Rated Choices
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}