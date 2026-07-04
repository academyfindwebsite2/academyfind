import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Search Hero */}
      <div className="rounded-3xl border border-slate-200 bg-white p-10">
        <Skeleton className="mx-auto h-12 w-72" />
        <Skeleton className="mx-auto mt-4 h-5 w-96" />

        <div className="mx-auto mt-8 max-w-3xl">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>

        <Skeleton className="mx-auto mt-5 h-4 w-40" />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside>
          <div className="rounded-2xl border border-slate-200 p-6">
            <Skeleton className="mb-6 h-6 w-24" />

            <div className="space-y-5">
              <div>
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div>
                <Skeleton className="mb-2 h-4 w-16" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <Skeleton className="mt-4 h-12 w-full rounded-xl" />
            </div>
          </div>
        </aside>

        {/* Results */}
        <main>
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

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-10 w-10 rounded-xl"
              />
            ))}
          </div>
        </main>
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