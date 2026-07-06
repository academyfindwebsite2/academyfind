import { cache } from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";

export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
});
