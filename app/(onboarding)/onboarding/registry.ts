import type { ComponentType } from "react";
import type { OnboardingInput } from "./types";
import WelcomeStep from "./components/steps/StepWelcome";
import UsernameStep from "./components/steps/StepUsername";
import PhoneStep from "./components/steps/StepPhone";
import CategoriesStep from "./components/steps/StepCategories";
import CitiesStep from "./components/steps/StepCities";
import NotificationStep from "./components/steps/StepNotifications";
import FinishStep from "./components/steps/StepFinish";
import type { StepProps } from "./types";
import { checkUsernameAvailability } from "../../../lib/User/user/checkUsernameAvailability";

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
    id: "username",
    title: "Choose Username",
    description: "Personalize your identity",
    component: UsernameStep,
    validate(data) {
      if (!data.username || data.username.length < 3) {
        return "Please enter a valid username (min 3 characters).";
      }
      return null;
    },
  },

  {
    id: "phone",

    title: "Phone Number",

    description: "Contact Information",

    component: PhoneStep,

    validate(data) {
      if (!data.phone || data.phone.length < 10) {
        return "Please enter a valid phone number (min 10 digits).";
      }

      return null;
    },
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