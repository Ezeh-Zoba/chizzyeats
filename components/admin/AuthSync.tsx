"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/**
 * Keeps the `chizzy_session` cookie (read by middleware.ts) in sync with the
 * Firebase Auth SDK's current ID token, which auto-refreshes roughly hourly.
 */
export function AuthSync() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) return;
      const idToken = await user.getIdToken();
      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }).catch(() => {});
    });
    return unsubscribe;
  }, []);

  return null;
}
