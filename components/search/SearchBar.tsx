"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  return (
    <div
      className="
        flex
        h-14
        w-full
        items-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-2
        shadow-lg
        sm:h-24
        sm:flex-col
      "
    >
      <Search className="ml-2 mr-3 h-5 w-5 shrink-0 text-amber-400" />

      <Input
        placeholder="Search coaching institutes..."
        className="
          flex-1
          border-0
          p-0
          text-sm
          shadow-none
          focus-visible:ring-0

          sm:text-base
        "
      />

      <Button
        className="
          h-10
          rounded-xl
          bg-amber-400
          px-4
          text-sm
          font-medium
          hover:bg-amber-500

          sm:h-24
          sm:px-10
        "
      >
        Search
      </Button>
    </div>
  );
}