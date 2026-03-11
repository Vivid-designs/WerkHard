"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-ink-500 px-4 py-2 text-sm font-semibold text-parchment-100 hover:bg-ink-700"
    >
      Log out
    </button>
  );
}
