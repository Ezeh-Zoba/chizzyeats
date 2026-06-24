"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { auth, functions } from "@/lib/firebase/client";

async function postSession(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error(`Failed to set session cookie (${res.status})`);
}

async function syncSessionAndBootstrap(router: ReturnType<typeof useRouter>) {
  const user = auth.currentUser;
  if (!user) return;

  const idToken = await user.getIdToken();
  await postSession(idToken);

  try {
    const grantAdmin = httpsCallable(functions, "grantAdmin");
    await grantAdmin({ email: user.email });
  } catch (err) {
    if (!(err instanceof FunctionsError) || err.code !== "functions/permission-denied") throw err;
  }

  const tokenResult = await user.getIdTokenResult(true);
  await postSession(tokenResult.token);

  router.push(tokenResult.claims.role === "admin" ? "/admin" : "/account");
  router.refresh();
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    syncSessionAndBootstrap(router).catch(() => {});
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      await syncSessionAndBootstrap(router);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await syncSessionAndBootstrap(router);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-3xl"
        style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 8px 40px var(--ce-shadow-elevated)" }}
      >
        <h1
          className="mb-1 text-center"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "28px", color: "var(--ce-text)", fontWeight: 800 }}
        >
          Chizzy Eats
        </h1>
        <p className="mb-6 text-center text-sm" style={{ color: "var(--ce-text-muted)" }}>
          Sign in to continue
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
            style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
            style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl text-sm transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-3 text-xs text-center"
          style={{ color: "#FF8C42", fontWeight: 600 }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--ce-border)" }} />
          <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--ce-border)" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 rounded-2xl text-sm transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "var(--ce-bg-card)", color: "var(--ce-text)", fontWeight: 600, border: "1.5px solid var(--ce-border)" }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
