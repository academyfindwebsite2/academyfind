"use server";

import { prisma } from "@/lib/prisma";

// We need to import generateUsername and isReservedUsername from username.ts
import { generateUsername as createBaseUsername, isReservedUsername } from "./username";

export async function getAvailableUsernameSuggestions(
  name: string,
  count: number = 3
): Promise<string[]> {
  const baseUsername = createBaseUsername(name);
  const suggestions: string[] = [];
  const maxAttempts = 20; // Prevent infinite loops
  let attempts = 0;

  // Suffix patterns: none, random 2-digit, random 3-digit, random 4-digit
  const suffixes = ["", ...Array.from({ length: maxAttempts }, () => Math.floor(Math.random() * 900) + 100)];

  for (const suffix of suffixes) {
    if (suggestions.length >= count) break;

    const candidate = suffix === "" ? baseUsername : `${baseUsername}${suffix}`;

    // Skip if reserved or invalid length
    if (isReservedUsername(candidate) || candidate.length < 3 || candidate.length > 30) {
      continue;
    }

    // Check availability in DB
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });

    if (!existing) {
      if (!suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
    }
    
    attempts++;
    if (attempts >= maxAttempts) break;
  }

  // Fallback if we couldn't generate enough from name
  while (suggestions.length < count && attempts < maxAttempts * 2) {
      const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
      const candidate = `user${randomSuffix}`;
      
      const existing = await prisma.user.findUnique({
        where: { username: candidate },
        select: { id: true },
      });
  
      if (!existing && !suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
      attempts++;
  }

  return suggestions;
}
