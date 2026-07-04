import { z } from "zod";

import type { onboardingSchema } from "./validation";

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export interface OnboardingCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface OnboardingCity {
  id: string;
  name: string;
  state: string;
}

export interface StepProps {
  formData: OnboardingInput;

  updateForm: (
    values: Partial<OnboardingInput>
  ) => void;

  categories: OnboardingCategory[];

  cities: OnboardingCity[];

  isSubmitting: boolean;
}

export interface OnboardingUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}