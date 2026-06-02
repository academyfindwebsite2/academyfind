import { Button } from "@/components/ui/button";

export default function CategoryCTA() {
  return (
    <section className="container mx-auto px-4 pb-20">
      <div className="rounded-[32px] bg-amber-500 p-8 md:p-12 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Not sure which path is right for you?
            </h2>

            <p className="mt-3 text-amber-50">
              Compare institutes across categories and
              decide with confidence.
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
          >
            Start Comparing
          </Button>
        </div>
      </div>
    </section>
  );
}