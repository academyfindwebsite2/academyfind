"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { completeOnboarding } from "../action";
import type { OnboardingInput } from "../types";

interface UseOnboardingProps {
  totalSteps: number;
  initialData: OnboardingInput;
}

export function useOnboarding({
  totalSteps,
  initialData,
}: UseOnboardingProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] =
    useState<OnboardingInput>(initialData);

  const [error, setError] = useState("");

  const [isPending, startTransition] =
    useTransition();

  const isFirstStep = currentStep === 0;

  const isLastStep =
    currentStep === totalSteps - 1;

  function updateForm(
    values: Partial<OnboardingInput>
  ) {
    setFormData((prev) => ({
      ...prev,
      ...values,
    }));
  }

  function validateStep() {
    setError("");

    switch (currentStep) {
      case 1:
        if (formData.categories.length === 0) {
          setError(
            "Please select at least one category."
          );
          return false;
        }
        break;

      case 2:
        if (formData.cities.length === 0) {
          setError(
            "Please select at least one city."
          );
          return false;
        }
        break;
    }

    return true;
  }

  function previous() {
    if (isFirstStep) return;

    setError("");

    setCurrentStep((prev) => prev - 1);
  }

  function next() {
    if (!validateStep()) return;

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function submit() {
    if (!validateStep()) return;

    startTransition(async () => {
      const result =
        await completeOnboarding(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.replace("/");

      router.refresh();
    });
  }

  return {
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
  };
}