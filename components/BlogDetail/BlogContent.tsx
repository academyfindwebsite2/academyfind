import Image from "next/image";

export default function BlogContent() {
  return (
    <article>
      <div className="relative h-[300px] overflow-hidden rounded-3xl md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
          alt="Blog Cover"
          fill
          className="object-cover"
        />
      </div>

      <div className="mt-10 space-y-8 text-slate-700">
        <section id="introduction">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Introduction
          </h2>

          <p>
            Kota continues to remain one of the
            most preferred destinations for JEE
            preparation in India.
          </p>
        </section>

        <section id="institutes">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Top Institutes
          </h2>

          <p>
            Allen, Resonance, Motion and Vibrant
            Academy remain among the top choices.
          </p>
        </section>

        <section id="fees">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Fees Comparison
          </h2>

          <p>
            Fees vary depending on course,
            duration and scholarship eligibility.
          </p>
        </section>

        <section id="results">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Results Comparison
          </h2>

          <p>
            Previous year results can help
            students evaluate institutes.
          </p>
        </section>

        <section id="verdict">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Final Verdict
          </h2>

          <p>
            The best institute depends on your
            learning style and goals.
          </p>
        </section>
      </div>
    </article>
  );
}