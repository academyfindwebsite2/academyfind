"use client";

import { Sparkles } from "lucide-react";

import type { StepProps } from "../../types";

export default function WelcomeStep({
  formData,
  updateForm,
}: StepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <Sparkles className="h-10 w-10 text-amber-400" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to AcademyFind 👋
      </h1>

      <p className="mt-4 max-w-xl text-lg text-slate-600">
        Let's personalize your AcademyFind experience so we can
        recommend the most relevant institutes, courses and updates.
      </p>

      <div className="mt-10 grid w-full max-w-2xl gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-slate-50 p-5">
          <h3 className="font-semibold">Discover</h3>

          <p className="mt-2 text-sm text-slate-600">
            Find institutes based on your interests.
          </p>
        </div>

        <div className="rounded-xl border bg-slate-50 p-5">
          <h3 className="font-semibold">Connect</h3>

          <p className="mt-2 text-sm text-slate-600">
            Join institutes and interact with teachers & students.
          </p>
        </div>

        <div className="rounded-xl border bg-slate-50 p-5">
          <h3 className="font-semibold">Grow</h3>

          <p className="mt-2 text-sm text-slate-600">
            Receive personalized recommendations and updates.
          </p>
        </div>
      </div>
    </div>
  );
}