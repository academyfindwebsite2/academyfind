export default function CityAbout({
  categoryName,
  cityName,
}: {
  categoryName: string;
  cityName: string;
}) {
  return (
    <section className="mt-20">
      <div className="mb-8">
        <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
          About This Category
        </span>

        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
          About {categoryName} in {cityName}
        </h2>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 md:p-10">
        <p className="text-slate-700 leading-8">
          Explore and compare the best{" "}
          <span className="font-semibold text-slate-900">
            {categoryName}
          </span>{" "}
          institutes in{" "}
          <span className="font-semibold text-slate-900">
            {cityName}
          </span>
          . Compare ratings, reviews, courses, faculty,
          facilities, and student feedback to find the
          right institute for your goals.
        </p>

        <p className="mt-5 text-slate-600 leading-8">
          AcademyFind helps students discover trusted
          institutes by providing transparent information,
          verified reviews, and detailed institute profiles
          in one place.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-white p-5">
            <p className="text-2xl font-bold text-amber-600">
              300+
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Institutes Listed
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5">
            <p className="text-2xl font-bold text-amber-600">
              50K+
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Student Reviews
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5">
            <p className="text-2xl font-bold text-amber-600">
              100+
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Cities Covered
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}