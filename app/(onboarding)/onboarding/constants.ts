import type { ComponentType } from "react";

import WelcomeStep from "./components/steps/StepWelcome";
import CategoriesStep from "./components/steps/StepCategories";
import CitiesStep from "./components/steps/StepCities";



export interface OnboardingStepDefinition {
  id: string;
  title: string;
  description?: string;

  component: ComponentType<any>;
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
  },
  {
    id: "cities",
    title: "Cities",
    description: "Preferred cities",
    component: CitiesStep,
  },
];