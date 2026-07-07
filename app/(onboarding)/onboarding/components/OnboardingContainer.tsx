import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "./OnboardingWizard";


interface OnboardingContainerProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    username?: string | null;
    phone?: string | null;
  };
}

import type {
    OnboardingCategory,
    OnboardingCity,
} from "../types";

export async function OnboardingContainer({
  user,
}: OnboardingContainerProps) {
  const [categories, cities] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    }),

    prisma.city.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        state: true,
      },
    }),
  ]);

  return (
    <OnboardingWizard
      user={user}
      categories={categories}
      cities={cities}
    />
  );
}