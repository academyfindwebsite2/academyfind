import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Flame,
} from "lucide-react";

interface TrendingPostsProps {
  posts: any[];
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80";

export default function TrendingPosts({ posts }: TrendingPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[600px] w-[600px] rounded-full bg-orange-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
              <Flame className="h-4 w-4" />
              Hot Right Now
            </span>

            <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Trending <span className="text-amber-500">Stories.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              Discover the articles that the student community can't stop reading this week.
            </p>
          </div>

          <Link
            href="/blog/search?sort=popular"
            className="group hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-amber-500 hover:text-slate-950 md:inline-flex"
          >
            Explore All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel/Grid hybrid for trending */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:ring-amber-500/50 hover:shadow-[0_0_30px_rgb(245,158,11,0.2)]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Rank Number Background */}
              <div className="absolute -right-6 -top-10 z-0 select-none text-[8rem] font-black leading-none text-white/5 transition-colors group-hover:text-amber-500/10">
                {index + 1}
              </div>

              <div className="relative z-10 aspect-[4/3] overflow-hidden">
                <Image
                  src={post.coverImage || DEFAULT_IMAGE}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                
                <div className="absolute bottom-4 left-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg">
                  {post.category?.name || "Education"}
                </div>
              </div>

              <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Clock3 className="h-4 w-4" />
                    {post.readingTime || 5} min read
                  </div>

                  <h3 className="mt-4 line-clamp-3 text-xl font-bold leading-snug text-slate-200 transition group-hover:text-amber-300">
                    {post.title}
                  </h3>
                </div>
                
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm font-medium text-slate-400">
                    {post.authorProfile?.displayName || "Editorial"}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-amber-500 group-hover:text-slate-950">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/blog/search?sort=popular"
            className="group inline-flex items-center gap-3 rounded-full bg-amber-500 px-8 py-4 font-bold text-slate-950 transition-all hover:bg-amber-400"
          >
            Explore All Trending
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}