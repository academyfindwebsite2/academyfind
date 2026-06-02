import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: React.ElementType;
  slug: string;
}

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  slug,
}: Props) {
  return (
    <Link href={`/${slug}`}>
      <div
        className="
        group
        rounded-3xl
        border
        bg-card
        p-6
        h-full
        transition-all
        hover:-translate-y-1
        hover:border-amber-300
        hover:shadow-xl
      "
      >
        <div className="flex justify-between">
          <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/20">
            <Icon className="h-6 w-6 text-amber-500" />
          </div>

          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>

        <h3 className="mt-10 text-3xl font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-muted-foreground">
          {description}
        </p>

        <div className="mt-6">
          <span className="rounded-full bg-muted px-3 py-1 text-xs">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}