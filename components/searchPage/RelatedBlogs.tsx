import { BookOpenText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RelatedBlogs() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Guides & Resources
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center sm:p-12 transition-all hover:border-amber-300 hover:bg-amber-50/30">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm border border-slate-100">
          <BookOpenText className="h-8 w-8" />
        </div>
        
        <div className="mx-auto max-w-md">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-3.5 w-3.5" /> Featured Articles
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">
            Expert Articles & Preparation Guides
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Explore our curated collection of expert-written articles and preparation guides to help you make informed decisions about your education and career path.
          </p>
          <p className="mt-4">
            <Link prefetch={false} href="/blog" className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600">
              Explore Blogs
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}