import { Layers3 } from "lucide-react";

export default function CategoriesHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-background to-background dark:from-amber-950/20" />

      <div className="container mx-auto px-4 pt-16 pb-12 relative">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm shadow-sm">
          <Layers3 className="h-4 w-4 text-amber-500" />
          All Categories
        </div>

        <div className="mt-8 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Explore Every{" "}
            <span className="text-amber-400">
              Preparation Goal
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Browse all exam categories and discover top-rated
            institutes tailored to your educational journey.
          </p>
        </div>
      </div>
    </section>
  );
}