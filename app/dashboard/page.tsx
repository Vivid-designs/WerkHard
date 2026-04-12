"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserPreview from "@/components/admin/UserPreview";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    router.replace("/");
  }

  return (
    <section className="container-wide py-16 md:py-24">
      <div className="mx-auto max-w-3xl rounded-lg border border-ink-700 bg-ink-800/80 p-8 md:p-10">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600">
          Admin Dashboard
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-parchment-100 md:text-5xl">
          Dashboard
        </h1>
        <p className="mt-4 font-body text-base leading-relaxed text-parchment-300">
          Welkom terug{user?.email ? `, ${user.email}` : ""}. Dit is jou privaat paneelbord.
        </p>

        <div className="mt-10 rounded-md border border-ink-600 bg-ink-900/70 p-6">
          <h2 className="font-serif text-xl text-parchment-100">Skryfwerk bestuur</h2>
          <p className="mt-2 font-body text-sm text-parchment-400">
            Gaan na die skryf-paneel om stukke te skep, te redigeer en te publiseer.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard/writing"
              className="font-sans text-xs tracking-widest uppercase text-parchment-300 hover:text-parchment-100 border border-ink-500 hover:border-ink-400 rounded px-4 py-2 transition-all duration-200"
            >
              Bestuur skryfwerk
            </Link>
            <Link
              href="/dashboard/writing/new"
              className="font-sans text-xs tracking-widest uppercase text-ink-900 bg-parchment-200 border border-parchment-200 hover:bg-parchment-100 rounded px-4 py-2 transition-all duration-200"
            >
              + Nuwe stuk
            </Link>
          </div>
        </div>

        <section className="mt-10 animate-fade-up opacity-0 delay-500">
          <UserPreview />
        </section>

        <div className="mt-10">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={[
              "font-sans text-xs tracking-widest uppercase",
              "text-parchment-300 hover:text-parchment-100",
              "border border-ink-500 hover:border-ink-400",
              "rounded px-5 py-2.5 transition-all duration-200",
              loggingOut ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
          >
            {loggingOut ? "Meld af…" : "Meld af"}
          </button>
        </div>
      </div>
    </section>
  );
}
