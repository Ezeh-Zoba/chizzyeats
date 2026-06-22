"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "@/lib/firebase/client";

async function syncSessionAndBootstrap(router: ReturnType<typeof useRouter>) {
  const user = auth.currentUser;
  if (!user) return;

  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  // Try to claim the bootstrap admin slot. No-ops (rejected) once an admin
  // already exists — safe to call on every sign-in.
  try {
    const grantAdmin = httpsCallable(functions, "grantAdmin");
    await grantAdmin({ email: user.email });
    const refreshedToken = await user.getIdToken(true);
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: refreshedToken }),
    });
  } catch {
    // Not eligible for bootstrap — fine, continue as a regular signed-in user.
  }

  router.push("/admin");
  router.refresh();
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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
      style={{ backgroundColor: "#FFF8E7", fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-3xl"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(92,64,51,0.12)" }}
      >
        <h1
          className="mb-1 text-center"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#5C4033", fontWeight: 800 }}
        >
          Chizzy's Eats
        </h1>
        <p className="mb-6 text-center text-sm" style={{ color: "#8B6F47" }}>
          Admin sign in
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
            style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
            style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
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
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(92,64,51,0.12)" }} />
          <span className="text-xs" style={{ color: "#8B6F47" }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(92,64,51,0.12)" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 rounded-2xl text-sm transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#fff", color: "#5C4033", fontWeight: 600, border: "1.5px solid rgba(92,64,51,0.15)" }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
