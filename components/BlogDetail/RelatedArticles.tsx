import Link from "next/link";

export default function RelatedArticles() {
  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold">
        Related Articles
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          href="/blog/allen-vs-resonance"
          className="
            rounded-3xl
            border
            border-amber-100
            bg-white
            p-6
            transition-all
            hover:-translate-y-1
            hover:shadow-lg
          "
        >
          <h3 className="font-semibold">
            Allen vs Resonance
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Compare the two most popular
            coaching institutes.
          </p>
        </Link>

        <Link
          href="/blog/best-neet-coaching-delhi"
          className="
            rounded-3xl
            border
            border-amber-100
            bg-white
            p-6
            transition-all
            hover:-translate-y-1
            hover:shadow-lg
          "
        >
          <h3 className="font-semibold">
            Best NEET Coaching In Delhi
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Discover top medical coaching
            institutes.
          </p>
        </Link>
      </div>
    </section>
  );
}