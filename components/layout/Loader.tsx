export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-96 rounded bg-muted" />
        <div className="h-5 w-full max-w-xl rounded bg-muted" />
        <div className="h-5 w-80 rounded bg-muted" />
      </div>
    </div>
  );
}