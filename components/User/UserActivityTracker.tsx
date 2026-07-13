"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";

export default function UserActivityTracker() {
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (session?.user?.id) {
            // Ping the API to update lastLoginAt (throttled server-side)
            fetch("/api/user/active", { method: "POST" }).catch(() => {});
        }
    }, [session?.user?.id]);

    return null;
}
