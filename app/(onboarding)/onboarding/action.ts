"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";


import { onboardingSchema } from "./validation";
import { getCachedSession } from "@/lib/auth/session";

type ActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function completeOnboarding(
  input: unknown
): Promise<ActionResult> {
  const session = await getCachedSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const parsed = onboardingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      // Create preference if it doesn't exist
      const preference = await tx.userPreference.upsert({
        where: {
          userId: session.user.id,
        },

        create: {
          userId: session.user.id,

          emailOnDm: data.notifications.emailOnDm,
          emailOnNews: data.notifications.emailOnNews,
          emailOnUpdates: data.notifications.emailOnUpdates,
        },

        update: {
          emailOnDm: data.notifications.emailOnDm,
          emailOnNews: data.notifications.emailOnNews,
          emailOnUpdates: data.notifications.emailOnUpdates,
        },
      });

      // Replace preferred categories
      await tx.userPreferredCategory.deleteMany({
        where: {
          preferenceId: preference.id,
        },
      });

      if (data.categories.length > 0) {
        await tx.userPreferredCategory.createMany({
          data: data.categories.map((categoryId) => ({
            preferenceId: preference.id,
            categoryId,
          })),
        });
      }

      // Replace preferred cities
      await tx.userPreferenceCity.deleteMany({
        where: {
          preferenceId: preference.id,
        },
      });

      if (data.cities.length > 0) {
        await tx.userPreferenceCity.createMany({
          data: data.cities.map((cityId) => ({
            preferenceId: preference.id,
            cityId,
          })),
        });
      }

      // Mark onboarding complete and set phone
      await tx.user.update({
        where: {
          id: session.user.id,
        },

        data: {
          username: data.username,
          phone: data.phone,
          onboardingCompleted: true,
        },
      });
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("[ONBOARDING_COMPLETE]", error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      return {
        success: false,
        error: "This username is already taken. Please choose another one.",
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}