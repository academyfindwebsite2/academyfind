import Link from "next/link";

export default function BlogCTA() {
  return (
    <section
      className="
        mt-20
        rounded-3xl
        bg-gradient-to-r
        from-amber-500
        to-orange-500
        p-10
        text-center
        text-white
      "
    >
      <h2 className="text-4xl font-bold">
        Find Your Ideal Coaching Institute
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-amber-100">
        Explore verified coaching institutes,
        compare options and make better decisions.
      </p>

      <Link
        href="/categories"
        className="
          mt-8
          inline-flex
          rounded-xl
          bg-white
          px-6
          py-3
          font-medium
          text-amber-600
          hover:bg-amber-50
        "
      >
        Explore Institutes
      </Link>
    </section>
  );
}