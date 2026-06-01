import Link from "next/link";
import Image from "next/image";

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
        block
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      <div className="flex gap-4">

        {/* IMAGE */}

        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* CONTENT */}

        <div className="flex-1">

          <h3 className="text-lg font-semibold">
            {name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            📍 {city.name}
          </p>

          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-700">
              {description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-sm">

            {averageRating && (
              <span>
                ⭐ {averageRating.toFixed(1)}
              </span>
            )}

            {reviewCount !== undefined && (
              <span>
                {reviewCount} Reviews
              </span>
            )}

          </div>

        </div>

      </div>
    </Link>
  );
}