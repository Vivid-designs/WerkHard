"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/admin-users";
import { formatDateShort } from "@/lib/utils";

export default function UserPreview() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((response) => response.json())
      .then((data) => setUsers((data.users ?? []).slice(0, 5)))
      .catch(() => setError("Kon nie gebruikers laai nie."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section aria-labelledby="user-preview-heading">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-1">
            Gebruikers
          </p>
          <h2 id="user-preview-heading" className="font-serif text-display-sm text-parchment-100">
            Nuutste gebruikers
          </h2>
        </div>

        <Link
          href="/dashboard/users"
          className="font-sans text-xs tracking-wide text-parchment-500 hover:text-parchment-200 transition-colors duration-200 underline underline-offset-4 decoration-parchment-600"
        >
          Sien alle gebruikers →
        </Link>
      </div>

      <div className="border border-ink-600 rounded-lg overflow-hidden">
        {loading ? (
          <PreviewSkeleton />
        ) : error ? (
          <div className="px-5 py-6 text-center">
            <p className="font-sans text-xs text-peach">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="font-sans text-xs text-parchment-600">Geen gebruikers nie.</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-ink-600 bg-ink-800">
                <th className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600">
                  E-pos
                </th>
                <th className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600 hidden sm:table-cell">
                  Aangemeld
                </th>
                <th className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody className="bg-ink-900 divide-y divide-ink-600">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-ink-800/50 transition-colors duration-150">
                  <td className="py-3 px-5">
                    <span className="font-body text-sm text-parchment-300 group-hover:text-parchment-200 transition-colors duration-150 truncate block max-w-[200px]">
                      {user.email}
                    </span>
                  </td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    <time className="font-sans text-xs text-parchment-600 tabular-nums">
                      {formatDateShort(user.created_at)}
                    </time>
                  </td>
                  <td className="py-3 px-5">
                    <RoleBadge isAdmin={user.is_admin} blocked={user.blocked} role={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function PreviewSkeleton() {
  return (
    <div className="divide-y divide-ink-600">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-3">
          <div className="h-3 bg-ink-700 rounded w-2/5 animate-pulse" />
          <div className="h-3 bg-ink-700 rounded w-1/5 animate-pulse hidden sm:block" />
          <div className="h-4 bg-ink-700 rounded w-12 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function RoleBadge({ isAdmin, blocked, role }: { isAdmin: boolean; blocked: boolean; role?: string }) {
  if (blocked) {
    return <span className="tag border text-peach bg-peach/10 border-peach/20">Geblokkeer</span>;
  }

  const effectiveRole = role ?? (isAdmin ? "admin" : "normal");

  if (effectiveRole === "admin") {
    return <span className="tag border text-lavender bg-lavender/10 border-lavender/20">Admin</span>;
  }

  if (effectiveRole === "super_lario") {
    return <span className="tag border text-amber-400 bg-amber-400/10 border-amber-400/20">Super Lario</span>;
  }

  return <span className="tag border text-parchment-500 bg-ink-700 border-ink-500">Gebruiker</span>;
}
