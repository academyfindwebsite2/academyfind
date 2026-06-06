import Link from "next/link";
import SmartButton from "../ui/SmartButton";

export default function AboutCTA() {
  return (
    <section
      className="
        rounded-3xl
        bg-gradient-to-r
        from-amber-500
        to-orange-500
        p-12
        text-center
        text-white
      "
    >
      <h2 className="text-4xl font-bold">
        Ready To Find Your Ideal Coaching?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-amber-100">
        Explore thousands of institutes and make
        informed decisions for your future.
      </p>

      <SmartButton
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
          transition
          hover:bg-amber-50
        "
      >
        Explore Institutes
      </SmartButton>
    </section>
  );
}