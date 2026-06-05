import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Star } from "lucide-react";

export interface InstituteCardProps {
  id: string;
  slug: string;

  name: string;

  description?: string | null;

  city: {
    name: string;
    slug: string;
  };

  averageRating?: number | null;
  reviewCount?: number | null;

  website?: string | null;

  image?: string | null;
}

export default function InstituteCard({
  id,
  slug,
  name,
  description,
  city,
  averageRating,
  reviewCount,
  image,
}: InstituteCardProps) {
  return (
    <Link
      href={`/institute/${id}-${slug}`}
      className="
        group
        block
        overflow-hidden
        rounded-2xl
        border
        bg-background
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-200
        hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {image ? (
          <Image
            src="/inst.jpg"
            alt={name}
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">
              No Image
            </span>
          </div>
        )}
        

        {/* Rating */}
        {averageRating && (
          <div
            className="
              absolute
              right-3
              top-3
              flex
              items-center
              gap-1
              rounded-full
              bg-background/90
              px-3
              py-1
              backdrop-blur
            "
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="
              line-clamp-2
              text-lg
              font-semibold
              transition-colors
              group-hover:text-amber-500
            "
          >
            {name}
          </h3>

          <ArrowRight
            className="
              h-4
              w-4
              shrink-0
              text-muted-foreground
              transition-all
              group-hover:translate-x-1
              group-hover:text-amber-500
            "
          />
        </div>

        {/* City */}
        <div
          className="
            mt-3
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-amber-50
            px-3
            py-1
            text-xs
            font-medium
            text-amber-600
          "
        >
          <MapPin className="h-3 w-3" />
          {city.name}
        </div>

        {/* Description */}
        {description && (
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {reviewCount ?? 0} reviews
          </span>

          <span className="text-sm font-medium text-amber-500">
            View Profile
          </span>
        </div>
      </div>
    </Link>
  );
}