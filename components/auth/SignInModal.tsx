"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

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
      reset();
      onOpenChange(false);
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
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
        <DialogTitle
          className="text-center"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "24px", color: "var(--ce-text)", fontWeight: 800 }}
        >
          Sign In
        </DialogTitle>
        <DialogDescription className="text-center text-sm" style={{ color: "var(--ce-text-muted)" }}>
          Sign in to comment on recipes and track your comment history.
        </DialogDescription>

        {error && (
          <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
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
          className="w-full text-xs text-center"
          style={{ color: "#FF8C42", fontWeight: 600 }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        <div className="flex items-center gap-3">
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
      </DialogContent>
    </Dialog>
  );
}
