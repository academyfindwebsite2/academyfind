"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      {/* Previous Button */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
          currentPage <= 1
            ? "pointer-events-none opacity-50 bg-slate-50 text-slate-400"
            : "bg-white text-slate-700 shadow-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {/* Page Info (e.g., Page 1 of 43) */}
      <span className="text-sm font-medium text-amber-500">
        Page <strong className="text-amber-500">{currentPage}</strong> of{" "}
        <strong className="text-amber-500">{totalPages}</strong>
      </span>

      {/* Next Button */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-50 bg-slate-50 text-slate-400"
            : "bg-white text-slate-700 shadow-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}