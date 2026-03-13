"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await signOut();
    router.push("/login");
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="rounded-md border border-ink-500 px-4 py-2 text-sm font-semibold text-parchment-100 hover:bg-ink-700 disabled:cursor-wait disabled:opacity-60"
    >
      {isSubmitting ? "Logging out…" : "Log out"}
    </button>
  );
}
