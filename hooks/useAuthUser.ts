"use client";

import { useEffect, useState } from "react";
import { onIdTokenChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AuthUserState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuthUser(): AuthUserState {
  const [state, setState] = useState<AuthUserState>({ user: null, isAdmin: false, loading: true });

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, isAdmin: false, loading: false });
        return;
      }
      const tokenResult = await user.getIdTokenResult();
      setState({ user, isAdmin: tokenResult.claims.role === "admin", loading: false });
    });
    return unsubscribe;
  }, []);

  return state;
}
