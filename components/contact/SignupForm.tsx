"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const inputClass = [
  "w-full bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
  "border border-ink-500 rounded-md px-4 py-3 text-sm font-body",
  "transition-colors duration-200",
  "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
].join(" ");

const labelClass = "block font-sans text-xs tracking-wide text-parchment-500 mb-1.5";

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const supabase = getSupabaseBrowserClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!fullName.trim()) return "Volle naam is verpligtend.";
    if (!email.trim()) return "E-pos is verpligtend.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Voer 'n geldige e-posadres in.";
    if (!phone.trim()) return "Foonnommer is verpligtend.";
    if (password.length < 8) return "Wagwoord moet minstens 8 karakters wees.";
    if (password !== confirm) return "Wagwoorde stem nie ooreen nie.";
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Geen gebruiker teruggegee nie.");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        } as never)
        .eq("id", authData.user.id);

      if (profileError) {
        console.warn("[signup] profile update failed:", profileError.message);
      }

      onSuccess();
    } catch (e: unknown) {
      const msg: string = e instanceof Error ? e.message : "Registrasie het misluk.";
      if (msg.includes("already registered")) {
        setError("Hierdie e-pos is reeds geregistreer. Probeer om in te teken.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="signup-name" className={labelClass}>
          Volle naam <span className="text-rose" aria-hidden="true">*</span>
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jou naam"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="signup-email" className={labelClass}>
          E-pos <span className="text-rose" aria-hidden="true">*</span>
        </label>
        <input
          id="signup-email"
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
        <label htmlFor="signup-phone" className={labelClass}>
          Foonnommer <span className="text-rose" aria-hidden="true">*</span>
        </label>
        <input
          id="signup-phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+27 82 000 0000"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="signup-password" className={labelClass}>
          Wagwoord <span className="text-rose" aria-hidden="true">*</span>
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minstens 8 karakters"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="signup-confirm" className={labelClass}>
          Bevestig wagwoord <span className="text-rose" aria-hidden="true">*</span>
        </label>
        <input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Herhaal jou wagwoord"
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
        {loading ? "Registreer…" : "Skep rekening"}
      </button>

      <p className="text-center font-sans text-xs text-parchment-600">
        Het jy reeds 'n rekening?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-parchment-400 hover:text-parchment-200 underline underline-offset-4 transition-colors duration-200"
        >
          Teken in
        </button>
      </p>
    </form>
  );
}
