"use client";

import { Loader2 } from "lucide-react";

interface NavigationButtonsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function NavigationButtons({
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  return (
    <div className="mt-10 flex items-center justify-between border-t pt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="inline-flex h-11 items-center rounded-lg border border-slate-300 px-5 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-lg bg-amber-500 px-6 font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isLastStep ? (
          "Finish"
        ) : (
          "Next"
        )}
      </button>
    </div>
  );
}