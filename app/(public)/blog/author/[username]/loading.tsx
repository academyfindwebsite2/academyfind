import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border">
        <Skeleton className="h-32 w-full" />

        <div className="px-8 pb-8">
          <div className="-mt-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <Skeleton className="h-28 w-28 rounded-full border-4 border-white" />

              <div className="space-y-3">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <Skeleton className="mb-4 h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Heading */}
      <div className="mt-14 mb-8">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-3 h-5 w-36" />
      </div>

      {/* Blog Cards */}
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
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
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