"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = [
    "w-full bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
    "border border-ink-500 rounded-md px-4 py-3 text-sm font-body",
    "transition-colors duration-200",
    "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
  ].join(" ");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Verkeerde e-pos of wagwoord. Probeer weer.");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-up opacity-0">
        <div className="text-center mb-10">
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-4">
            Spencesa
          </p>
          <h1 className="font-serif text-2xl text-parchment-100">Welkom terug.</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="font-sans text-xs tracking-wide text-parchment-500"
            >
              E-pos
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jy@spencesa.co.za"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="font-sans text-xs tracking-wide text-parchment-500"
            >
              Wagwoord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error ? (
            <p className="font-sans text-xs text-peach" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={[
              "mt-2 w-full font-sans text-sm tracking-wide",
              "bg-parchment-200 text-ink-900 border border-parchment-200",
              "hover:bg-parchment-100 rounded-md py-3",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/40",
              loading ? "opacity-60 cursor-wait" : "",
            ].join(" ")}
          >
            {loading ? "Teken in…" : "Teken in"}
          </button>
        </form>
      </div>
    </div>
  );
}
