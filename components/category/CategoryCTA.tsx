import { Button } from "@/components/ui/button";

export default function CategoryCTA() {
  return (
    <section className="py-20 border-t">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border p-10 text-center">
          <h2 className="text-4xl font-bold text-amber-400">
            Start Exploring Today
          </h2>

          <p className="mt-4 text-muted-foreground">
            Compare institutes, reviews and fees
            before making a decision.
          </p>

          <Button
            size="lg"
            className="mt-8 text-amber-500 bg-white border border-amber-600 cursor-pointer hover"
          >
            Explore Institutes
          </Button>
        </div>
      </div>
    </section>
  );
}