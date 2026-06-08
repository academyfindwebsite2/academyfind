"use client"

import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { CldImage } from "next-cloudinary"
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
  googleRating?: number | null; // Added
  googleReviewCount?: number | null; // Added
  website?: string | null;
  image?: string | null;
  distance?: string | null;
}

export default function InstituteCard({
  id,
  slug,
  name,
  description,
  city,
  averageRating,
  reviewCount,
  googleRating,
  googleReviewCount,
  image,
  distance,
}: InstituteCardProps) {
  
  const isCloudinaryImage = image?.includes("cloudinary.com");
  
  // Priority: googleRating > averageRating > null
  const displayRating = googleRating ?? averageRating;
  console.log(googleRating)
  const displayReviewCount = googleReviewCount ?? reviewCount ?? 0;

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
        {image && isCloudinaryImage ? (
          <CldImage
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        // ) : image ? (
        //   <img 
        //     src={image} 
        //     alt={name} 
        //     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        //   />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Image src="/inst.jpg" alt="No Image" width={400} height={400}/>
          </div>
        )}

        {/* Rating */}
        {displayRating ? (
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
              {displayRating.toFixed(1)}
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-amber-500">
            {name}
          </h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-amber-500" />
        </div>

        {/* City aur Distance ka Row (Aamne-Samne) */}
        <div className="mt-3 flex items-center gap-2 justify-between">
          {/* City Chip */}
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
            <MapPin className="h-3 w-3" />
            {city.name}
          </div>

          {/* Distance Chip */}
          {distance && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <MapPin className="h-3 w-3 text-amber-500" />
              {distance} km away
            </div>
          )}
        </div>

        {/* Description (Ye alag se block mein rahega) */}
        {description && (
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{displayReviewCount} reviews</span>
          <span className="text-sm font-medium text-amber-500">View Profile</span>
        </div>
      </div>
  </Link>
        );
}