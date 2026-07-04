"use client";

import { CheckCircle2 } from "lucide-react";

import type { StepProps } from "../../types";

export default function FinishStep({
  formData,
  isSubmitting = false,
}: StepProps) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <CheckCircle2 className="h-20 w-20 text-green-500" />

      <h2 className="mt-6 text-4xl font-bold">
        You're all set! 🎉
      </h2>

      <p className="mt-3 max-w-xl text-slate-600">
        Review your preferences below. Click <strong>Finish</strong> to
        complete your onboarding and start exploring AcademyFind.
      </p>

      <div className="mt-10 w-full max-w-xl rounded-2xl border bg-slate-50 p-6 text-left">
        <div className="flex items-center justify-between border-b pb-4">
          <span className="font-medium">Categories Selected</span>

          <span className="font-semibold">
            {formData.categories.length}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-b pb-4">
          <span className="font-medium">Cities Selected</span>

          <span className="font-semibold">
            {formData.cities.length}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Email DMs</span>

            <span>
              {formData.notifications.emailOnDm ? "On" : "Off"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>News</span>

            <span>
              {formData.notifications.emailOnNews ? "On" : "Off"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Updates</span>

            <span>
              {formData.notifications.emailOnUpdates ? "On" : "Off"}
            </span>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <p className="mt-6 text-sm text-slate-500">
          Saving your preferences...
        </p>
      )}
    </div>
  );
}