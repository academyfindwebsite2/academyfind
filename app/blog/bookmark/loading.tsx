import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Hero */}
      <div className="rounded-3xl border border-slate-200 p-10">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-4 h-5 w-[520px]" />
        <Skeleton className="mt-8 h-12 w-48 rounded-xl" />
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 p-6"
          >
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="mt-5 h-8 w-20" />
            <Skeleton className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-10 rounded-2xl border border-slate-200 p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index: number) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-slate-200"
          >
            <Skeleton className="aspect-[16/9] w-full" />

            <div className="space-y-4 p-5">
              <Skeleton className="h-6 w-3/4" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />

              <div className="flex justify-between pt-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index: number) => (
          <Skeleton
            key={index}
            className="h-10 w-10 rounded-xl"
          />
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-20 rounded-3xl border border-slate-200 p-10">
        <Skeleton className="mx-auto h-8 w-72" />
        <Skeleton className="mx-auto mt-4 h-5 w-96" />
        <Skeleton className="mx-auto mt-8 h-12 w-80 rounded-xl" />
      </div>
    </div>
  );
}