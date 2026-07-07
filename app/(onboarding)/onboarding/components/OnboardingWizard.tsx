"use client";
import { ProgressBar } from "./ProgressBar";
import { NavigationButtons } from "./NavigationButtons";


import type {
  OnboardingCategory,
  OnboardingCity,
  OnboardingInput,
} from "../types";
import { useOnboarding } from "../hooks/useOnboarding";
import { ONBOARDING_STEPS } from "../registry";

interface OnboardingWizardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };

  categories: OnboardingCategory[];
  cities: OnboardingCity[];
}

const initialData: OnboardingInput = {
  username: "",
  phone: "",
  categories: [],
  cities: [],
  notifications: {
    emailOnDm: true,
    emailOnNews: true,
    emailOnUpdates: true,
  },
};

export function OnboardingWizard({
  user,
  categories,
  cities,
}: OnboardingWizardProps) {
  const totalSteps = ONBOARDING_STEPS.length;

  const onboarding = useOnboarding({
    totalSteps,
    initialData,
  });

  const {
    currentStep,
    formData,
    error,
    isPending,
    isFirstStep,
    isLastStep,
    updateForm,
    next,
    previous,
    submit,
  } = onboarding;

  const currentStepDefinition = ONBOARDING_STEPS[currentStep];

  if (!currentStepDefinition) {
    return (
      <div className="rounded-3xl border bg-white p-8 shadow-xl">
        <p className="text-center text-sm text-gray-500">
            Invalid step. Please refresh the page.
        </p>
      </div>
    );
  }

  const Currentstep = currentStepDefinition.component;


  return (
    <div className="rounded-3xl border bg-white p-8 shadow-xl">
      <ProgressBar
        currentStep={currentStep + 1}
        totalSteps={totalSteps}
        title={currentStepDefinition.title}
        description={currentStepDefinition.description}
      />

      <div className="mt-10 min-h-[420px]">
        <Currentstep
          key={currentStepDefinition.id}
          user={user}
          formData={formData}
          updateForm={updateForm}
          categories={categories}
          cities={cities}
          isSubmitting={isPending}
        />
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <NavigationButtons
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isPending}
        onBack={previous}
        onNext={isLastStep ? submit : next}
      />
    </div>
  );
}