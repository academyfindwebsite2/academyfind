import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-slate-200">
        <Skeleton className="h-72 w-full" />

        <div className="space-y-5 p-8">
          <Skeleton className="h-10 w-64" />

          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />

          <div className="mt-6 flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 w-36 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mt-14 mb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-5 w-40" />
      </div>

      {/* Cards */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200"
          >
            <Skeleton className="aspect-[16/9] w-full" />

            <div className="space-y-4 p-5">
              <Skeleton className="h-6 w-3/4" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />

              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-20 rounded-3xl border p-10">
        <Skeleton className="mx-auto h-8 w-72" />
        <Skeleton className="mx-auto mt-4 h-5 w-96" />
        <Skeleton className="mx-auto mt-8 h-12 w-80 rounded-xl" />
      </div>
    </div>
  );
}