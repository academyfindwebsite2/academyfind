export default function AdminBlogLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex justify-between">
        <div className="space-y-3">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-purple-200" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item: number) => (
          <div key={item} className="h-24 rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="h-16 rounded-2xl bg-slate-100" />
      <div className="h-[520px] rounded-2xl bg-slate-100" />
    </div>
  );
}
