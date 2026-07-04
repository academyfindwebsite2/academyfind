export default function EditBlogLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-slate-50/80">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-slate-200" />
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-slate-200" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
          </div>
          <div className="hidden gap-2 sm:flex">
            <div className="h-9 w-28 rounded-lg bg-slate-200" />
            <div className="h-9 w-24 rounded-lg bg-amber-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <div className="h-80 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
          <div className="h-[700px] rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
        </div>
        <div className="space-y-6">
          <div className="aspect-video rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
          <div className="h-72 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
          <div className="h-80 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
        </div>
      </div>
    </main>
  );
}
