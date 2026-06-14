import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InteractiveLink from "../ui/InteractiveLink";
import SmartButton from "../ui/SmartButton";

export default function CityCTA() {
  return (
    <section className="mt-20">
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-linear-to-br from-amber-400 via-orange-400 to-amber-500 p-10 md:p-14 text-center text-white">

        {/* Glow */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
            Compare Before You Decide
          </span>

          <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">
            Find Your Ideal Institute
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-orange-50">
            Compare courses, fees, reviews and ratings from
            top institutes before making the most important
            decision of your academic journey.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-amber-500 hover:bg-orange-50 cursor-pointer"
            >
              <Link href={"/"}>Explore Institutes</Link>
              
            </Button>

            <Button
              disabled 
              variant="outline"
              size="lg"
              className="
                bg-white
                border-white/50
                text-black
                text-sm
                font-semibold
                opacity-80 
                cursor-not-allowed
              "
            >
              Compare (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}