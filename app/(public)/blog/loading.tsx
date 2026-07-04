export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-amber-400 border-b-amber-400 border-l-slate-200 border-r-slate-200"></div>
        <p className="text-lg font-medium text-slate-700">Loading...</p>
      </div>
    </div>
  );
}