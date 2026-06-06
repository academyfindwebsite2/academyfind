import Link from "next/link";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

const categories = [
  {
    name: "JEE",
    slug: "jee-coaching",
  },
  {
    name: "UPSC",
    slug: "upsc-coaching",
  },
  {
    name: "NEET",
    slug: "neet-coaching",
  },
  {
    name: "CAT",
    slug: "cat-coaching",
  },
];

const cities = [
  {
    name: "Noida",
    slug: "jee-coaching/noida",
  },
  {
    name: "Delhi",
    slug: "upsc-coaching/delhi",
  },
  
];

const comparisons = [
  "Allen vs Motion",
  "Vision IAS vs Drishti IAS",
  "PW vs Unacademy",
  "Aakash vs Allen",
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Top */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="
                flex
                items-center
                gap-2
                justify-center
                sm:justify-start
              "
            >
              <Image
                src="/square-logo.png"
                alt="AcademyFind Logo"
                width={36}
                height={36} />

              <div>
                <h2 className="text-xl font-bold">
                  AcademyFind
                </h2>

                <p className="text-[11px] text-muted-foreground">
                  Academy Search Simplified
                </p>
              </div>
            </Link>

            <p
              className="
                mt-4
                max-w-sm
                text-center
                text-sm
                text-muted-foreground
                sm:text-left
              "
            >
              Discover coaching institutes, compare options,
              read reviews, and make smarter education decisions.
            </p>

            {/* Trust Badge */}
            <div
              className="
                mt-5
                inline-flex
                rounded-full
                border
                bg-background
                px-3
                py-1.5
                text-xs
                text-muted-foreground
              "
            >
              🇮🇳 Trusted by Students Across India
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">
              Categories
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              {categories.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${item.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="mb-4 font-semibold">
              Popular Cities
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              {cities.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${item.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h3 className="mb-4 font-semibold">
              Compare
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              {comparisons.map((item) => (
                <li key={item}>
                  <Link
                    href="/compare"
                    className="transition-colors hover:text-foreground"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            mt-10
            border-t
            pt-6
            text-sm
            text-muted-foreground
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              gap-4
              text-center
              md:flex-row
              md:justify-between
              md:text-left
            "
          >
            <p>
              © 2026 AcademyFind. All rights reserved.
            </p>

            <div
              className="
                flex
                flex-wrap
                justify-center
                gap-4
                md:justify-end
                md:gap-6
              "
            >
              <Link
                href="/about"
                className="transition-colors hover:text-foreground"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="transition-colors hover:text-foreground"
              >
                Contact Us
              </Link>

              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}