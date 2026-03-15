"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signInWithPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

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

    const signInError = await signInWithPassword({ email, password });

    if (signInError) {
      setError("Verkeerde e-pos of wagwoord. Probeer weer.");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-ink-900 flex items-center justify-center px-6">
      <Link
        href="/"
        aria-label="Terug na tuisblad"
        className={[
          "absolute left-6 top-6 inline-flex items-center gap-2",
          "font-sans text-xs tracking-wide text-parchment-500",
          "transition-all duration-200",
          "hover:text-parchment-200 hover:-translate-x-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 rounded-md px-2 py-1",
        ].join(" ")}
      >
        <span aria-hidden="true" className="text-base leading-none">
          ←
        </span>
        <span className="uppercase tracking-[0.18em]">Tuis</span>
      </Link>

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
            disabled={loading || isLoading}
            className={[
              "mt-3 w-full font-sans text-sm tracking-[0.08em] uppercase",
              "bg-parchment-100 text-ink-900 border border-parchment-300",
              "shadow-[0_0_0_1px_rgba(238,227,198,0.08),0_10px_28px_rgba(10,10,13,0.4)]",
              "hover:bg-parchment-200 hover:border-parchment-200 hover:shadow-[0_0_0_1px_rgba(238,227,198,0.14),0_14px_32px_rgba(10,10,13,0.5)]",
              "rounded-md py-3.5",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/40",
              loading || isLoading ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {loading ? "Teken in…" : "Teken in"}
          </button>
        </form>
      </div>
    </div>
  );
}
