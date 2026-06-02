import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SearchBar } from "@/components/search/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const trendingSearches = [
  "Allen vs Motion",
  "JEE Coaching in Kota",
  "UPSC Coaching in Delhi",
  "NEET Coaching in Jaipur",
];

export function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-amber-50/50 via-background to-background">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          
          {/* LEFT */}
          <div>
            <Badge className="mb-5">
              India's Coaching Discovery Platform
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Find the Right
              <span className="block text-amber-500">
                Coaching Institute
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Compare coaching institutes, explore cities,
              read reviews, and discover the best place
              for your preparation journey.
            </p>

            {/* Search */}
            <div className="mt-8">
              <SearchBar />
            </div>

            {/* Trending */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                🔥 Trending Today
              </p>

              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="
                      rounded-full
                      border
                      bg-background
                      px-4
                      py-2
                      text-sm
                      transition-all
                      hover:border-amber-200
                      hover:bg-amber-50
                    "
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Link */}
            <Link
              href="/categories"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                font-medium
                text-amber-500
              "
            >
              Browse All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* RIGHT */}
          <div>
            <Card className="rounded-3xl border shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">
                  Free Expert Guidance
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Get personalized coaching recommendations
                  based on your goals and preferred city.
                </p>

                <div className="mt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="
                      w-full
                      rounded-xl
                      border
                      px-4
                      py-3
                      outline-none
                      focus:border-amber-400
                    "
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="
                      w-full
                      rounded-xl
                      border
                      px-4
                      py-3
                      outline-none
                      focus:border-amber-400
                    "
                  />

                  <select
                    className="
                      w-full
                      rounded-xl
                      border
                      px-4
                      py-3
                      outline-none
                      focus:border-amber-400
                    "
                  >
                    <option>Select Exam</option>
                    <option>JEE</option>
                    <option>NEET</option>
                    <option>UPSC</option>
                    <option>CAT</option>
                    <option>SSC</option>
                    <option>CLAT</option>
                    <option>Others</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="Your Query"
                    className="
                      w-full
                      rounded-xl
                      border
                      px-4
                      py-3
                      outline-none
                      focus:border-amber-400
                    "
                  />
                </div>

                <Button
                  className="
                    mt-5
                    w-full
                    bg-amber-500
                    hover:bg-amber-600
                    h-9
                    w-full
                    rounded-xl
                  "
                >
                  Get Free Guidance
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  No spam. We'll only contact you regarding
                  coaching recommendations.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}