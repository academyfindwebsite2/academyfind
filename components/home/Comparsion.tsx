import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";


export async function PopularComparisons() {
  const [topComparisons, instituteCount, comparisonCount] = await Promise.all([
      prisma.instituteComparisonCache.findMany({
        orderBy: { viewCount: 'desc' },
        take: 3,
        include: {
          institute1: { select: { name: true, logo: true, googleRating: true, googleReviewCount: true, feeInfo: true, city: { select: { name: true } } } },
          institute2: { select: { name: true, logo: true, googleRating: true, googleReviewCount: true, feeInfo: true, city: { select: { name: true } } } },
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
            prefetch={false}
            className="hidden md:flex items-center gap-2 font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            View All Comparisons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 🚀 Active Grid without Blur */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {topComparisons.map((comparison: any) => (
            <Link 
              key={comparison.slug} 
              href={`/compare/${comparison.slug}`} // 👈 Route to the page we built earlier
              className="group block"
              prefetch={false}
            >
              <Card className="h-full overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md transition-all duration-500 hover:shadow-[0_20px_40px_rgba(251,191,36,0.15)] hover:border-amber-200 hover:-translate-y-2 hover:[transform:perspective(1000px)_rotateX(3deg)_rotateY(-3deg)]">
                <CardContent className="p-0 sm:p-0">
                  <div className="flex relative">
                    {/* Institute A side */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col items-center text-center bg-gradient-to-br from-white to-amber-50/30 group-hover:to-amber-50/50 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-lg font-black text-slate-700 group-hover:border-amber-200 group-hover:text-amber-600 transition-colors overflow-hidden">
                        {comparison.institute1.logo ? (
                          <img src={comparison.institute1.logo} alt={comparison.institute1.name} className="object-cover w-full h-full" />
                        ) : (
                          comparison.institute1.name.charAt(0)
                        )}
                      </div>
                      <span className="mt-3 text-sm font-bold sm:text-base text-slate-800 line-clamp-2 min-h-[40px]">
                        {comparison.institute1.name}
                      </span>
                      {/* Stats A */}
                      <div className="mt-4 space-y-2 w-full opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-wrap items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-100 rounded-full px-2 py-1 shadow-sm w-full">
                           ⭐ {comparison.institute1.googleRating?.toFixed(1) || "New"}
                           <span className="text-slate-400 font-normal">({comparison.institute1.googleReviewCount || 0})</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 truncate w-full px-1">
                          💸 {comparison.institute1.feeInfo || "On Request"}
                        </div>
                      </div>
                    </div>

                    {/* VS Badge - Absolute center */}
                    <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                      <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-white bg-slate-50 shadow-md text-[10px] font-black text-slate-400 group-hover:border-amber-100 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-amber-500/30 group-hover:scale-110 transition-all duration-300">
                        VS
                      </div>
                    </div>

                    {/* Institute B side */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col items-center text-center bg-gradient-to-bl from-white to-blue-50/30 group-hover:to-blue-50/50 transition-colors border-l border-slate-50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-lg font-black text-slate-700 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors overflow-hidden">
                        {comparison.institute2.logo ? (
                          <img src={comparison.institute2.logo} alt={comparison.institute2.name} className="object-cover w-full h-full" />
                        ) : (
                          comparison.institute2.name.charAt(0)
                        )}
                      </div>
                      <span className="mt-3 text-sm font-bold sm:text-base text-slate-800 line-clamp-2 min-h-[40px]">
                        {comparison.institute2.name}
                      </span>
                      {/* Stats B */}
                      <div className="mt-4 space-y-2 w-full opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-wrap items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-100 rounded-full px-2 py-1 shadow-sm w-full">
                           ⭐ {comparison.institute2.googleRating?.toFixed(1) || "New"}
                           <span className="text-slate-400 font-normal">({comparison.institute2.googleReviewCount || 0})</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 truncate w-full px-1">
                          💸 {comparison.institute2.feeInfo || "On Request"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5">
                    <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm group-hover:border-amber-200 group-hover:text-amber-600 transition-colors">
                      {comparison.institute1.city?.name || comparison.institute2.city?.name || "Online"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
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
            prefetch={false}
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