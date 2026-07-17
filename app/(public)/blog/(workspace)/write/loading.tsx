export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-10 w-28 animate-pulse rounded-xl bg-amber-200" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-5 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* Excerpt */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* Editor */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex gap-2 border-b border-slate-200 p-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 animate-pulse rounded-lg bg-slate-200"
                  />
                ))}
              </div>

              <div className="space-y-4 p-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-slate-100"
                    style={{
                      width: `${90 - (i % 3) * 12}%`,
                    }}
                  />
                ))}
              </div>

              <div className="border-t border-slate-200 p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-5 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}