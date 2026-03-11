"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("lario@vividgraphics.co.za");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Login failed. Check your email/password and try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="container-narrow py-20">
      <div className="mx-auto max-w-md rounded-xl border border-ink-700 bg-ink-800 p-8 shadow-lg">
        <h1 className="font-serif text-3xl text-parchment-100">Admin Login</h1>
        <p className="mt-2 text-sm text-parchment-400">
          Sign in to access the admin section.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-parchment-300">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-parchment-100 outline-none focus:border-gold-500"
            />
          </label>

          <label className="block text-sm text-parchment-300">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-parchment-100 outline-none focus:border-gold-500"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gold-500 px-4 py-2 font-semibold text-ink-900 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
