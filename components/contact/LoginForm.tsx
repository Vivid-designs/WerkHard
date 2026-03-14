"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const inputClass = [
  "w-full bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
  "border border-ink-500 rounded-md px-4 py-3 text-sm font-body",
  "transition-colors duration-200",
  "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
].join(" ");

const labelClass = "block font-sans text-xs tracking-wide text-parchment-500 mb-1.5";

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Verkeerde e-pos of wagwoord. Probeer weer.");
      setLoading(false);
      return;
    }

    router.replace("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="login-email" className={labelClass}>
          E-pos
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jy@voorbeeld.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="login-password" className={labelClass}>
          Wagwoord
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Jou wagwoord"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="font-sans text-xs text-peach leading-relaxed" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={[
          "w-full font-sans text-sm tracking-wide",
          "bg-parchment-200 text-ink-900 border border-parchment-200",
          "hover:bg-parchment-100 rounded-md py-3 mt-1",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/40",
          loading ? "opacity-60 cursor-wait" : "",
        ].join(" ")}
      >
        {loading ? "Teken in…" : "Teken in"}
      </button>

      <p className="text-center font-sans text-xs text-parchment-600">
        Nog geen rekening nie?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-parchment-400 hover:text-parchment-200 underline underline-offset-4 transition-colors duration-200"
        >
          Registreer hier
        </button>
      </p>
    </form>
  );
}
