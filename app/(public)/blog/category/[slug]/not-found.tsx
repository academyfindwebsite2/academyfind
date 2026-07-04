import Link from "next/link";
import { ArrowLeft, FolderSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
        <FolderSearch className="h-12 w-12 text-amber-600" />
      </div>

      <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">
        Category Not Found
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
        The category you're looking for doesn't exist or is currently
        unavailable.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}