"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCachedSession } from "@/lib/auth/session";

import { checkUsernameAvailability } from "./checkUsernameAvailability";

const updateUserProfileSchema = z.object({
  username: z.string(),

  name: z
    .string()
    .trim()
    .min(2)
    .max(60),

  image: z
    .string()
    .url()
    .nullable(),

  allowDms: z.boolean(),

  isVisible: z.boolean(),

  facebookUrl: z.string().url().nullable(),

  instagramUrl: z.string().url().nullable(),

  linkedinUrl: z.string().url().nullable(),

  youtubeUrl: z.string().url().nullable(),

  telegramUrl: z.string().url().nullable(),

  whatsappUrl: z.string().url().nullable(),

  twitterUrl: z.string().url().nullable(),
});

export async function updateUserProfile(
  input: z.infer<typeof updateUserProfileSchema>
) {
  const session = await getCachedSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const data =
    updateUserProfileSchema.parse(input);

  const usernameCheck =
    await checkUsernameAvailability(
      data.username,
      session.user.id
    );

  if (!usernameCheck.available) {
    return {
      success: false,
      message: usernameCheck.reason,
    };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },

    data: {
      username: usernameCheck.username,

      name: data.name,

      image: data.image,

      allowDms: data.allowDms,

      isVisible: data.isVisible,

      facebookUrl: data.facebookUrl,

      instagramUrl: data.instagramUrl,

      linkedinUrl: data.linkedinUrl,

      youtubeUrl: data.youtubeUrl,

      telegramUrl: data.telegramUrl,

      whatsappUrl: data.whatsappUrl,

      twitterUrl: data.twitterUrl,
    },
  });

  return {
    success: true,
  };
}