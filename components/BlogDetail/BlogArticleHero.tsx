import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
} from "lucide-react";

interface Props {
  idslug: string;
}

export default function BlogArticleHero({
  idslug,
}: Props) {
  return (
    <section className="border-b border-amber-100 bg-gradient-to-b from-amber-50 via-background to-background">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Home</Link>

          <ChevronRight className="h-4 w-4" />

          <Link href="/blog">Blog</Link>

          <ChevronRight className="h-4 w-4" />

          <span>{idslug}</span>
        </div>

        <div
          className="
            mt-8
            inline-flex
            rounded-full
            bg-amber-100
            px-4
            py-1
            text-sm
            font-medium
            text-amber-700
          "
        >
          JEE
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          Best JEE Coaching In Kota 2026
        </h1>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            June 2026
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            8 min read
          </div>
        </div>
      </div>
    </section>
  );
}