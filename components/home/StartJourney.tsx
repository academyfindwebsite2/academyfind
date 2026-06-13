"use client"; // 👈 Ye add karna zaroori hai kyunki hum onClick use karenge

import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StartJourney() {
  
  // Top par scroll karne ka function
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div
          className="
            rounded-2xl
            border
            bg-gradient-to-br
            from-amber-50
            via-background
            to-amber-50
            px-5
            py-10
            text-center
            shadow-sm
            sm:rounded-3xl
            sm:px-8
            sm:py-14
            lg:py-16
          "
        >
          {/* Icon */}
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-amber-100
              sm:h-16
              sm:w-16
            "
          >
            <Compass className="h-7 w-7 text-amber-500 sm:h-8 sm:w-8" />
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Ready to Start Your Journey?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore coaching institutes, compare options,
            read reviews, and discover the right place
            to achieve your goals.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            
            {/* 1. Explore Institutes - Scrolls to Top */}
            <Button
              onClick={handleScrollToTop} // 👈 Click karne par upar jayega
              size="lg"
              className="
                h-12
                bg-amber-500
                text-sm
                font-semibold
                hover:bg-amber-600
                sm:px-8
                cursor-pointer
              "
            >
              Explore Institutes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* 2. Compare Institutes - Coming Soon */}
            <Button
              disabled // 👈 Button click disable kar diya
              variant="outline"
              size="lg"
              className="
                h-12
                text-sm
                font-semibold
                sm:px-8
                opacity-60 // 👈 Thoda transparent feel dene ke liye
                cursor-not-allowed // 👈 Mouse pointer update karne ke liye
              "
            >
              Compare (Coming Soon)
            </Button>
          </div>

          {/* Trust Text */}
          <p className="mt-5 text-xs text-muted-foreground sm:text-sm">
            Trusted by thousands of students across India.
          </p>
        </div>
      </div>
    </section>
  );
}