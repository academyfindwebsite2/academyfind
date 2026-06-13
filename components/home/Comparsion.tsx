import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react"; // Sparkles icon add kiya hai

import { Card, CardContent } from "@/components/ui/card";

const comparisons = [
  {
    instituteA: "Allen",
    instituteB: "Motion",
    category: "JEE • Kota",
    href: "#", // Disabled href
  },
  {
    instituteA: "Vision IAS",
    instituteB: "Drishti IAS",
    category: "UPSC • Delhi",
    href: "#",
  },
  {
    instituteA: "PW",
    instituteB: "Unacademy",
    category: "Online Learning",
    href: "#",
  },
];

export function PopularComparisons() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-500">
                Compare Institutes
              </span>
              {/* Chhota Coming Soon Badge Header mein bhi */}
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Coming Soon
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Popular Comparisons
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Compare coaching institutes side-by-side and make smarter
              decisions before enrolling.
            </p>
          </div>

          <button
            disabled
            className="hidden md:flex items-center gap-2 font-medium text-muted-foreground opacity-50 cursor-not-allowed"
          >
            Compare More Institutes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 🚀 THE MAGIC: Relative Container for the Blur & Overlay */}
        <div className="relative">
          
          {/* ✨ BEAUTIFUL OVERLAY (Glassmorphism) */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[3px] border border-white/50">
            <div className="flex flex-col items-center p-8 bg-white border border-amber-100 shadow-2xl shadow-amber-900/5 rounded-3xl transform transition-transform hover:scale-105 duration-800">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-full mb-4 ring-8 ring-amber-50/50">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Advanced Comparison</h3>
              <p className="text-sm text-slate-500 mt-2 text-center max-w-[280px] leading-relaxed">
                We are building India's most powerful institute comparison engine. Stay tuned!
              </p>
              <div className="mt-6 px-6 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                Coming Soon
              </div>
            </div>
          </div>

          {/* Grid (Pointer events disabled & slightly faded so it sits in the background) */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 pointer-events-none opacity-60 select-none">
            {comparisons.map((comparison) => (
              <div key={`${comparison.instituteA}-${comparison.instituteB}`}>
                <Card className="h-full overflow-hidden rounded-2xl border bg-slate-50/50">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      {/* Institute A */}
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                          {comparison.instituteA.charAt(0)}
                        </div>
                        <span className="mt-3 text-sm font-semibold sm:text-base text-slate-600">
                          {comparison.instituteA}
                        </span>
                      </div>

                      {/* VS */}
                      <div className="flex flex-col items-center">
                        <div className="rounded-full border border-slate-300 bg-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                          VS
                        </div>
                        <span className="mt-2 text-xs text-slate-400">
                          Compare
                        </span>
                      </div>

                      {/* Institute B */}
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                          {comparison.instituteB.charAt(0)}
                        </div>
                        <span className="mt-3 text-sm font-semibold sm:text-base text-slate-600">
                          {comparison.instituteB}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                        {comparison.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium text-slate-400">
                        Compare
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile CTA Disabled */}
        <div className="mt-8 flex justify-center md:hidden">
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-medium text-muted-foreground opacity-50 cursor-not-allowed"
          >
            Compare More Institutes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}