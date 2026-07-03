import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";


export async function PopularComparisons() {
  const [topComparisons, instituteCount, comparisonCount] = await Promise.all([
      prisma.instituteComparisonCache.findMany({
        orderBy: { viewCount: 'desc' },
        take: 9,
        include: {
          institute1: { select: { name: true, logo: true, city: { select: { name: true } } } },
          institute2: { select: { name: true, logo: true, city: { select: { name: true } } } },
        },
      }),
      prisma.institute.count({ where: { isActive: true } }),
      prisma.instituteComparisonCache.count(),
    ]);
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-600">
                Compare Institutes
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                Live Now
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Trending Comparisons
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Compare top coaching institutes side-by-side and make smarter decisions before enrolling.
            </p>
          </div>

          <Link
            href="/compare"
            className="hidden md:flex items-center gap-2 font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            View All Comparisons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 🚀 Active Grid without Blur */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {topComparisons.map((comparison) => (
            <Link 
              key={comparison.slug} 
              href={`/compare/${comparison.slug}`} // 👈 Route to the page we built earlier
              className="group block"
            >
              <Card className="h-full overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-lg hover:border-amber-200 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    {/* Institute A */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-700 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                        {comparison.institute1.name.charAt(0)}
                      </div>
                      <span className="mt-3 text-sm font-bold sm:text-base text-slate-800">
                        {comparison.institute1.name}
                      </span>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center">
                      <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-400 group-hover:border-amber-200 group-hover:text-amber-500 transition-colors">
                        VS
                      </div>
                    </div>

                    {/* Institute B */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {comparison.institute2.name.charAt(0)}
                      </div>
                      <span className="mt-3 text-sm font-bold sm:text-base text-slate-800">
                        {comparison.institute2.name}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {comparison.institute1.city?.name || comparison.institute2.city?.name || "Unknown City"}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-amber-600 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Compare Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 font-bold text-amber-700"
          >
            View All Comparisons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}