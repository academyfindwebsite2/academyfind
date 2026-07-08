import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Stethoscope,
  Landmark,
  Briefcase,
  Scale,
  Globe,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const goals = [
  {
    title: "Engineering",
    description: "JEE, BITSAT, VITEEE",
    institutes: "4,200+ Institutes",
    href: "/jee-coaching",
    icon: GraduationCap,
  },
  {
    title: "Medical",
    description: "NEET, AIIMS",
    institutes: "3,100+ Institutes",
    href: "/neet-coaching",
    icon: Stethoscope,
  },
  {
    title: "Government Exams",
    description: "UPSC, SSC, Banking",
    institutes: "5,500+ Institutes",
    href: "/upsc-coaching",
    icon: Landmark,
  },
  {
    title: "Management",
    description: "CAT, XAT, SNAP",
    institutes: "1,400+ Institutes",
    href: "/cat-coaching",
    icon: Briefcase,
  },
  {
    title: "Law",
    description: "CLAT, AILET",
    institutes: "900+ Institutes",
    href: "/law-coaching",
    icon: Scale,
  },
  {
    title: "Study Abroad",
    description: "IELTS, GRE, GMAT",
    institutes: "1,100+ Institutes",
    href: "/gre-coaching",
    icon: Globe,
  },
];

export function ExploreByGoal() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-medium text-amber-500">
              Categories
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Explore By Goal
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Browse coaching institutes based on your preparation journey.
            </p>
          </div>

          <Link
            href="/categories"
            prefetch={false}
            className="hidden md:flex items-center gap-2 font-medium transition-colors hover:text-amber-500"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            const Icon = goal.icon;

            return (
              <Link key={goal.title} href={goal.href} prefetch={false}>
                <Card
                  className="
                    group
                    relative
                    h-full
                    overflow-hidden
                    rounded-2xl
                    border
                    transition-all
                    duration-300
                    md:hover:-translate-y-2
                    md:hover:border-amber-200
                    md:hover:shadow-2xl
                  "
                >
                  {/* Glow */}
                  <div
                    className="
                      absolute
                      -right-10
                      -top-10
                      h-32
                      w-32
                      rounded-full
                      bg-amber-100/40
                      blur-3xl
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  <CardContent className="relative p-4 sm:p-5">
                    {/* Top Row */}
                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-background
                          shadow-sm
                          transition-transform
                          duration-300
                          group-hover:scale-110
                        "
                      >
                        <Icon className="h-6 w-6 text-amber-500" />
                      </div>

                      <ArrowRight
                        className="
                          h-5
                          w-5
                          text-muted-foreground
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:text-amber-500
                        "
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {goal.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm text-muted-foreground">
                      {goal.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between">
                      <span
                        className="
                          rounded-full
                          bg-background/80
                          px-3
                          py-1
                          text-[11px]
                          font-medium
                          backdrop-blur
                          sm:text-xs
                        "
                      >
                        {goal.institutes}
                      </span>

                      <span className="text-sm font-medium text-amber-500">
                        Explore
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/categories"
            prefetch={false}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              px-4
              py-3
              font-medium
              transition-colors
              hover:bg-amber-50
            "
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}