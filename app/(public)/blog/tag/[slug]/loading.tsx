import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Hero */}
      <div className="rounded-3xl border border-slate-200 bg-white p-10">
        <Skeleton className="h-8 w-28 rounded-full" />

        <Skeleton className="mt-6 h-12 w-72" />

        <Skeleton className="mt-6 h-5 w-full" />
        <Skeleton className="mt-3 h-5 w-3/4" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Heading */}
      <div className="mt-14 mb-8">
        <Skeleton className="h-8 w-60" />
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