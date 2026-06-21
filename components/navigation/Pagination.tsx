"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1); // ✅ clamp client side bhi

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const safePage = Math.min(Math.max(1, pageNumber), totalPages); // ✅ always 1..totalPages
    const params = new URLSearchParams(searchParams);
    params.set("page", safePage.toString());
    return `${pathname}?${params.toString()}`;
  };

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      {/* Previous Button */}
      {isFirst ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border opacity-50 bg-slate-50 text-slate-400 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 shadow-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      )}

      <span className="text-sm font-medium text-amber-500">
        Page <strong className="text-amber-500">{currentPage}</strong> of{" "}
        <strong className="text-amber-500">{totalPages}</strong>
      </span>

      {/* Next Button */}
      {isLast ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border opacity-50 bg-slate-50 text-slate-400 cursor-not-allowed">
          <ChevronRight className="h-5 w-5" />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 shadow-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}