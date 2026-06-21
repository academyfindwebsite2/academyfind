import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTelegram, FaWhatsapp, FaYoutube } from "react-icons/fa";
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
    name: "Dance",
    slug: "dance-classes",
  },
  {
    name: "View All",
    slug: "categories",
  },
];

const cities = [
  {
    name: "Noida",
    slug: "categories?city=noida",
  },
  {
    name: "Delhi",
    slug: "categories?city=delhi",
  },
  {
    name: "Greater Noida",
    slug: "categories?city=greater-noida",
  },
  {
    name: "Faridabad",
    slug: "categories?city=faridabad",
  },
  {
    name: "Meerut",
    slug: "categories?city=meerut",
  },
  {
    name: "Ghaziabad",
    slug: "categories?city=ghaziabad",
  }
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

            <div className="mt-6 flex justify-center sm:justify-start gap-4">
              <SocialLink href="https://wa.me/919045699938" icon={<FaWhatsapp className="h-5 w-5 text-[#128C7E]" />} />
              <SocialLink href="https://t.me/academyfind" icon={<FaTelegram className="h-5 w-5 text-[#24A1DE]" />} />
              <SocialLink href="https://www.linkedin.com/company/academyfind" icon={<FaLinkedinIn className="h-5 w-5 text-[#0A66C2]" />} />
              <SocialLink href="https://www.facebook.com/profile.php?id=61561180379260" icon={<FaFacebook className="h-5 w-5 text-[#1877F2]" />} />
              <SocialLink href="https://www.instagram.com/academyfind" icon={<FaInstagram className="h-5 w-5 text-pink-400" />} />
              <SocialLink href="https://www.youtube.com/channel/UCYiRb6vo_Rr_w3PO746hsKg" icon={<FaYoutube className="h-5 w-5 text-[#FF0000]" />} />
            </div>

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
                    prefetch={false}
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
                    prefetch={false}
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
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold">
                Compare
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Coming Soon
              </span>
            </div>

            <ul className="space-y-3 text-sm text-muted-foreground opacity-50">
              {comparisons.map((item) => (
                <li key={item}>
                  <span className="cursor-not-allowed">
                    {item}
                  </span>
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
                href={"/privacy-policy"}
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>

              <Link
                  href={"/terms-condition"}
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

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link 
      prefetch={false}
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-muted-foreground transition-colors hover:text-amber-600"
    >
      {icon}
    </Link>
  );
}