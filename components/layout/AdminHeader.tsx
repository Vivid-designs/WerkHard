"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <header className="border-b border-ink-700 bg-ink-950">
      <div className="container-wide flex h-14 items-center justify-between">
        <Link
          href="/dashboard"
          className="font-serif text-base tracking-wide text-parchment-100 hover:text-white transition-colors duration-200"
        >
          Spencesa
          <span className="ml-2 font-sans text-2xs tracking-widest uppercase text-parchment-600 align-middle">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {user?.email ? (
            <span className="hidden sm:block font-sans text-xs text-parchment-600 truncate max-w-[180px]">
              {user.email}
            </span>
          ) : null}

          <button
            onClick={handleSignOut}
            className={[
              "font-sans text-xs tracking-widest uppercase",
              "text-parchment-500 hover:text-parchment-200",
              "border border-ink-500 hover:border-ink-400",
              "px-4 py-1.5 rounded transition-all duration-200",
            ].join(" ")}
          >
            Uitlog
          </button>
        </div>
      </div>
    </header>
  );
}
