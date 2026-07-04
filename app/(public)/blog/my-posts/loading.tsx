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
      <div className="rounded-3xl border border-slate-200 p-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-[500px]" />
        <Skeleton className="mt-8 h-12 w-44 rounded-xl" />
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border p-6"
          >
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-5 h-8 w-14" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-10 rounded-2xl border p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border"
          >
            <Skeleton className="aspect-[16/9] w-full" />

            <div className="space-y-4 p-6">
              <Skeleton className="h-7 w-3/4" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />

              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-14" />
              </div>

              <div className="flex justify-between pt-4">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}