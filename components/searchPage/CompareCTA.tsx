import { Scale, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CompareCTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-400 to-orange-500 p-10 sm:p-12 text-center text-white shadow-xl">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
          <Scale className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Still Confused?
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-amber-100 sm:text-lg">
          We are building India's most powerful side-by-side institute comparison tool. Evaluate fees, ratings, and features effortlessly.
        </p>

        {/* 🚀 Premium Coming Soon Badge instead of Button */}
        <div className="mt-8 inline-flex cursor-default items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
          <Sparkles className="h-5 w-5 text-amber-200" />
          <Link href="/compare" className="text-white">
            Compare Institutes
          </Link>
        </div>
      </div>
    </section>
  );
}