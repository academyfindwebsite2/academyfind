import { Building2, MapPin, Star } from "lucide-react";

export default function CityHero({
  categoryName,
  cityName,
}: {
  categoryName: string;
  cityName: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 via-white to-orange-50 p-8 md:p-12 mb-12">
      
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-4 py-1 text-sm font-medium text-amber-400">
          {cityName}
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
          Best {categoryName}
          <br />
          Institutes in {cityName}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Compare fees, ratings, reviews, faculty and courses
          from the highest-rated institutes in {cityName}.
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
          <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 backdrop-blur">
            <Building2 className="h-5 w-5 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-slate-900">
              312+
            </p>
            <p className="text-sm text-slate-500">
              Institutes
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 backdrop-blur">
            <MapPin className="h-5 w-5 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-slate-900">
              48+
            </p>
            <p className="text-sm text-slate-500">
              Cities
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 backdrop-blur">
            <Star className="h-5 w-5 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-slate-900">
              4.6
            </p>
            <p className="text-sm text-slate-500">
              Avg Rating
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}