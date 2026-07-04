import type { ComponentType } from "react";
import type { OnboardingInput } from "./types";
import WelcomeStep from "./components/steps/StepWelcome";
import CategoriesStep from "./components/steps/StepCategories";
import CitiesStep from "./components/steps/StepCities";
import NotificationStep from "./components/steps/StepNotifications";
import FinishStep from "./components/steps/StepFinish";
import type { StepProps } from "./types";

export interface OnboardingStepDefinition {
  id: string;
  title: string;
  description: string;

  component: ComponentType<StepProps>;

  canSkip?: boolean;

  validate?: (
    data: OnboardingInput
  ) => string | null;
}

export const ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    id: "welcome",

    title: "Welcome",

    description: "Introduction",

    component: WelcomeStep,
  },

  {
    id: "categories",

    title: "Categories",

    description: "Choose your interests",

    component: CategoriesStep,

    validate(data) {
      if (data.categories.length === 0) {
        return "Please select at least one category.";
      }

      return null;
    },
  },

  {
    id: "cities",

    title: "Cities",

    description: "Choose preferred cities",

    component: CitiesStep,

    validate(data) {
      if (data.cities.length === 0) {
        return "Please select at least one city.";
      }

      return null;
    },
  },

  {
    id: "notifications",

    title: "Notifications",

    description: "Notification preferences",

    component: NotificationStep,
  },

  {
    id: "finish",

    title: "Finish",

    description: "Complete onboarding",

    component: FinishStep,
  },
];