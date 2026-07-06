"use server";

import { prisma } from "@/lib/prisma";
import {
  normalizeUsername,
  validateUsername,
} from "./username";

export async function checkUsernameAvailability(
  username: string,
  currentUserId?: string
) {
  const normalized = normalizeUsername(username);

  const validation = validateUsername(normalized);

  if (!validation.success) {
    return {
      available: false,
      reason: validation.message,
    };
  }

  const existing = await prisma.user.findUnique({
    where: {
      username: normalized,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return {
      available: true,
      username: normalized,
    };
  }

  // Allow current user to keep their own username
  if (currentUserId && existing.id === currentUserId) {
    return {
      available: true,
      username: normalized,
    };
  }

  return {
    available: false,
    reason: "Username is already taken.",
  };
}