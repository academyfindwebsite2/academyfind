// components/home/LifeCoachCTA.tsx
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export function LifeCoachCTA() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className=" text-black rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/20 shadow-xl relative overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 max-w-2xl">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-400/20 hidden sm:block shrink-0">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Confused about what to search for? 
            </h3>
            <p className="text-amber-500 text-sm mt-1 leading-relaxed">
              Don't guess your career path alone. Speak directly with our certified expert Life Coaches to unlock your true potential and find the perfect path.
            </p>
          </div>
        </div>

        <Link href="/user/life-coach" className="shrink-0 w-full md:w-auto">
          <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/10 active:scale-95 group cursor-pointer">
            Consult a Life Coach
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </section>
  );
}