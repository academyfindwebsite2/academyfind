import BlogHero from "@/components/blog/BlogHero";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import BlogCategories from "@/components/blog/BlogCategories";
import BlogGrid from "@/components/blog/BlogGrid";
import NewsletterCTA from "@/components/blog/NewsLetterCTA";
import { Sparkles, PenTool } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Educational Resources | AcademyFind",
  description: "Read the latest insights, expert interviews, exam tips, and study hacks on the AcademyFind blog. Our editorial space is launching soon!",
  alternates: {
    canonical: "https://www.academyfind.com/blog",
  },
  openGraph: {
    title: "AcademyFind Blog - Coming Soon",
    description: "Expert educational insights and study hacks are brewing. Stay tuned!",
    url: "https://www.academyfind.com/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <main className="mx-auto max-w-7xl px-4 py-12">
        
        {/* Coming Soon Wrapper */}
        <div className="relative">
          
          {/* Fresh Coming Soon Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/40 backdrop-blur-md border border-white/60">
            <div className="relative overflow-hidden flex flex-col items-center p-8 sm:p-12 bg-white/95 border border-amber-100 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] rounded-[2rem] transform transition-all hover:scale-[1.02] duration-500">
              
              {/* Animated background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>

              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-50 to-blue-50 text-amber-600 rounded-2xl mb-6 ring-4 ring-white shadow-sm -rotate-3 hover:rotate-0 transition-transform duration-300">
                <PenTool className="h-10 w-10" />
              </div>
              
              <div className="flex items-center gap-2 mb-4 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100/50">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
                  Coming Soon
                </span>
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
                Our Editorial <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Space</span>
              </h3>
              
              <p className="text-base text-slate-500 mt-4 text-center max-w-[340px] leading-relaxed">
                We're brewing some insightful articles, expert interviews, and study hacks. The wait will be worth it!
              </p>
              
              <div className="mt-10 flex items-center gap-4 bg-amber-50 px-5 py-3 rounded-2xl border border-amber-100">
                <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-amber-700">Authors drafting</span>
                  <span className="text-xs font-medium text-amber-400">Stay tuned for updates...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Faded Background Content */}
          <div className="pointer-events-none opacity-30 select-none grayscale-[40%] blur-[2px] transition-all duration-1000 pb-12">
            <FeaturedBlog />
            <BlogCategories />
            <BlogGrid />
            <div className="mt-12">
          <NewsletterCTA />
        </div>
          </div>

        </div>

        
      </main>
    </>
  );
}