"use client";

import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

type AuthMode = "signup" | "login";

export default function AuthSection() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="bg-ink-800 border border-sage/25 rounded-lg p-8 text-center">
        <div className="ornament text-parchment-600 text-sm mb-6 max-w-xs mx-auto" aria-hidden="true">
          ✦
        </div>
        <h3 className="font-serif text-xl text-parchment-100 mb-3">Welkom aan boord.</h3>
        <p className="font-body text-parchment-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          Jou rekening is geskep. Kyk jou e-pos vir &#39;n bevestigingskoppeling voordat jy inteken.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setMode("login");
          }}
          className={[
            "font-sans text-xs tracking-widest uppercase",
            "text-parchment-400 hover:text-parchment-200",
            "underline underline-offset-4 decoration-parchment-600",
            "transition-colors duration-200",
          ].join(" ")}
        >
          Gaan na inteken →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-lg overflow-hidden">
      <div className="flex border-b border-ink-600" role="tablist" aria-label="Opsies">
        {(["signup", "login"] as AuthMode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={[
              "flex-1 py-4 font-sans text-xs tracking-widest uppercase",
              "transition-all duration-200 border-b-2 -mb-px",
              "focus-visible:outline-none",
              mode === m
                ? "text-parchment-200 border-parchment-400"
                : "text-parchment-600 border-transparent hover:text-parchment-400",
            ].join(" ")}
          >
            {m === "signup" ? "Nuwe rekening" : "Teken in"}
          </button>
        ))}
      </div>

      <div className="p-7 md:p-8">
        {mode === "signup" ? (
          <SignupForm onSuccess={() => setSuccess(true)} onSwitchToLogin={() => setMode("login")} />
        ) : (
          <LoginForm onSwitchToSignup={() => setMode("signup")} />
        )}
      </div>
    </div>
  );
}
