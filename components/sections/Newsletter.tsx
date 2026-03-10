"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    // Future: POST /api/newsletter → supabase.from('subscribers').insert({ email })
    await new Promise((r) => setTimeout(r, 800));

    setStatus("success");
    setMessage("You're on the list. Thank you.");
    setEmail("");
  }

  return (
    <section aria-labelledby="newsletter-heading" className="bg-ink-950">
      <div className="container-narrow section-spacing">
        <div className="max-w-xl mx-auto text-center">
          <div className="ornament text-parchment-600 text-sm mb-8 max-w-xs mx-auto" aria-hidden="true">
            ✦
          </div>

          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-3">
            Stay in touch
          </p>
          <h2
            id="newsletter-heading"
            className="font-serif text-display-sm text-parchment-100 mb-5"
          >
            New essays, occasionally.
          </h2>
          <p className="font-body text-parchment-400 text-sm leading-relaxed mb-10 max-w-reading mx-auto">
            No algorithm. No schedule. Just an email when something new is worth reading.
          </p>

          {status === "success" ? (
            <p className="font-body text-sage text-sm">{message}</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className={[
                  "flex-1 bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
                  "border border-ink-500 rounded-md px-4 py-2.5 text-sm font-body",
                  "transition-colors duration-200",
                  "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
                ].join(" ")}
              />
              <Button
                as="button"
                type="submit"
                variant="rose"
                size="md"
                disabled={status === "loading"}
                className={status === "loading" ? "opacity-60 cursor-wait" : ""}
              >
                {status === "loading" ? "Sending…" : "Subscribe"}
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 font-sans text-xs text-peach" role="alert">
              {message || "Something went wrong. Please try again."}
            </p>
          )}

          <p className="mt-5 font-sans text-xs text-parchment-600">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
