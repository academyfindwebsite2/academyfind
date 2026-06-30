import Link from "next/link";
import { BookmarkX, ArrowRight } from "lucide-react";

export default function BookmarkEmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-20 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
        <BookmarkX className="h-12 w-12 text-amber-600" />
      </div>

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        No Bookmarks Yet
      </h2>

      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
        You haven't bookmarked any articles yet. Save useful blogs to quickly
        access them later from your personal bookmark collection.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          Explore Blogs
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/blog/search"
          className="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Search Articles
        </Link>
      </div>
    </section>
  );
}