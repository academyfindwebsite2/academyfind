import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth"; // Aapka server-side instance

export const getCachedSession = cache(async () => {
  try {
    // Better Auth ka server-side session fetcher
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
});