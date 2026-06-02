import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CityCTA() {
  return (
    <section className="mt-20">
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-10 md:p-14 text-center text-white">

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
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              Explore Institutes
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              Compare Institutes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}