import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StartJourney() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div
          className="
            rounded-3xl
            border
            bg-gradient-to-br
            from-amber-50
            via-background
            to-amber-50
            px-8
            py-16
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-amber-100
            "
          >
            <Compass className="h-8 w-8 text-amber-500" />
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight">
            Ready to Start Your Journey?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Explore coaching institutes, compare options,
            read reviews, and discover the right place
            to achieve your goals.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Link href="/institutes">
                Explore Institutes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/compare">
                Compare Institutes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}