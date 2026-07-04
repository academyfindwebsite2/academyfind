"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  title,
  description,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-600">
            Step {currentStep} of {totalSteps}
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            {title}
          </h2>

          <p className="mt-2 max-w-xl text-sm text-slate-600">
            {description}
          </p>
        </div>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-300 ease-in-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}