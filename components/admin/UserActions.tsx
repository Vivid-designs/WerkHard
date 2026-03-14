"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/admin-users";

interface UserActionsProps {
  user: UserProfile;
  currentId: string;
  onRefresh: () => void;
}

type ActionState = "idle" | "loading" | "confirm_delete" | "editing";

async function apiPatch(id: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "Aksie het misluk.");
  }
}

export default function UserActions({ user, currentId, onRefresh }: UserActionsProps) {
  const [state, setState] = useState<ActionState>("idle");
  const [editName, setEditName] = useState(user.full_name ?? "");
  const [error, setError] = useState("");

  const isSelf = user.id === currentId;

  async function run(fn: () => Promise<void>) {
    setError("");
    setState("loading");

    try {
      await fn();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aksie het misluk.");
    } finally {
      setState("idle");
    }
  }

  async function handleDelete() {
    await run(async () => {
      const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Kon nie verwyder nie.");
      }
    });
  }

  async function handleReset() {
    await run(() =>
      fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      }).then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Kon nie herstel nie.");
        }
      }),
    );
  }

  async function handleSaveEdit() {
    await run(() => apiPatch(user.id, { action: "update_profile", full_name: editName }));
    setState("idle");
  }

  const btnBase = [
    "font-sans text-xs px-3 py-1.5 rounded border",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" ");

  const btnMuted = `${btnBase} text-parchment-500 border-ink-500 hover:border-parchment-500 hover:text-parchment-300`;
  const btnRose = `${btnBase} text-rose border-rose/30 hover:bg-rose/10 hover:border-rose/50`;
  const btnSage = `${btnBase} text-sage border-sage/30 hover:bg-sage/10 hover:border-sage/50`;
  const btnPeach = `${btnBase} text-peach border-peach/30 hover:bg-peach/10 hover:border-peach/50`;

  if (state === "confirm_delete") {
    return (
      <div className="flex items-center gap-2">
        <span className="font-sans text-xs text-parchment-500 mr-1">Seker?</span>
        <button onClick={handleDelete} className={btnRose}>
          Ja, verwyder
        </button>
        <button onClick={() => setState("idle")} className={btnMuted}>
          Kanselleer
        </button>
      </div>
    );
  }

  if (state === "editing") {
    return (
      <div className="flex items-center gap-2">
        <input
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
          placeholder="Naam"
          className={[
            "bg-ink-700 text-parchment-200 placeholder:text-parchment-600",
            "border border-ink-500 rounded px-3 py-1 text-xs font-body",
            "focus:outline-none focus:border-parchment-500",
            "w-36",
          ].join(" ")}
        />
        <button onClick={handleSaveEdit} className={btnSage}>
          Stoor
        </button>
        <button onClick={() => setState("idle")} className={btnMuted}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {error && (
        <span className="font-sans text-xs text-peach mr-1" role="alert">
          {error}
        </span>
      )}

      <button onClick={() => setState("editing")} disabled={state === "loading"} className={btnMuted}>
        Wysig
      </button>

      {!isSelf && (
        <button
          onClick={() => run(() => apiPatch(user.id, { action: user.blocked ? "unblock" : "block" }))}
          disabled={state === "loading"}
          className={user.blocked ? btnSage : btnPeach}
        >
          {user.blocked ? "Deblokkeer" : "Blokkeer"}
        </button>
      )}

      {!isSelf && (
        <button
          onClick={() =>
            run(() => apiPatch(user.id, { action: user.is_admin ? "remove_admin" : "set_admin" }))
          }
          disabled={state === "loading"}
          className={btnMuted}
        >
          {user.is_admin ? "Verwyder admin" : "Maak admin"}
        </button>
      )}

      <button
        onClick={handleReset}
        disabled={state === "loading"}
        className={btnMuted}
        title="Stuur wagwoord-herstel e-pos"
      >
        Herstel wagwoord
      </button>

      {!isSelf && (
        <button onClick={() => setState("confirm_delete")} disabled={state === "loading"} className={btnRose}>
          Verwyder
        </button>
      )}

      {state === "loading" && (
        <span className="font-sans text-xs text-parchment-600 animate-pulse">Besig…</span>
      )}
    </div>
  );
}
