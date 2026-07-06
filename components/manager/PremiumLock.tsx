"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PremiumLock({
  title,
  description,
  instituteId,
  isSmall = false,
}: {
  title: string;
  description: string;
  instituteId?: string;
  isSmall?: boolean;
}) {
  if (isSmall) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
        <Lock className="h-5 w-5 shrink-0" />
        <div className="flex-1 text-sm font-medium">{title}</div>
        {instituteId && (
          <Button asChild size="sm" variant="outline" className="border-amber-300 bg-white hover:bg-amber-100">
            <Link href={`/manager/${instituteId}/subscription`}>Upgrade</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Lock className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-800">{title}</h3>
      <p className="mb-6 max-w-md text-slate-500">{description}</p>
      {instituteId ? (
        <Button asChild className="bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold">
          <Link href={`/manager/${instituteId}/subscription`}>Upgrade to Premium Or Ultra</Link>
        </Button>
      ) : (
        <Button disabled className="bg-amber-600 text-white rounded-xl font-bold">
          Available on Premium Or Ultra
        </Button>
      )}
    </div>
  );
}
