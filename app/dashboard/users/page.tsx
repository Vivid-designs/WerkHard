"use client";

import { useCallback, useEffect, useState } from "react";
import UserActions from "@/components/admin/UserActions";
import { RoleBadge } from "@/components/admin/UserPreview";
import { useAuth } from "@/context/AuthContext";
import type { UserProfile } from "@/lib/admin-users";
import { formatDateShort } from "@/lib/utils";

type SortField = "email" | "created_at" | "last_sign_in_at";
type SortDir = "asc" | "desc";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">
      {children}
    </p>
  );
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
      });
      const data = (await response.json().catch(() => ({}))) as {
        users?: UserProfile[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Kon nie gebruikers laai nie.");
      }

      const nextUsers = Array.isArray(data.users) ? data.users : [];
      setUsers(nextUsers);

      if (!Array.isArray(data.users)) {
        console.error("[dashboard/users] Unexpected users payload", data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kon nie gebruikers laai nie.";
      setUsers([]);
      setError(message);
      console.error("[dashboard/users] Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayed = users
    .filter((user) =>
      search.trim()
        ? user.email.toLowerCase().includes(search.toLowerCase()) ||
          (user.full_name ?? "").toLowerCase().includes(search.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";

      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((currentDir) => (currentDir === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const thClass = [
    "text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600",
    "select-none cursor-pointer hover:text-parchment-400 transition-colors duration-150",
  ].join(" ");

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const stats = {
    total: users.length,
    admins: users.filter((user) => user.role === "admin").length,
    superLario: users.filter((user) => user.role === "super_lario").length,
    blocked: users.filter((user) => user.blocked).length,
  };

  return (
    <div className="container-narrow py-12 md:py-16 flex flex-col gap-12">
      <div className="animate-fade-up opacity-0 delay-100">
        <SectionLabel>Admin / Gebruikers</SectionLabel>
        <h1 className="font-serif text-display-md text-parchment-100">Gebruikersbestuur</h1>
        <p className="font-body text-parchment-500 text-sm mt-2">Bestuur alle geregistreerde gebruikers.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4 animate-fade-up opacity-0 delay-200" aria-label="Gebruiker statistieke">
        {[
          { label: "Totaal", value: stats.total },
          { label: "Admins", value: stats.admins },
          { label: "Super Lario", value: stats.superLario },
          { label: "Geblokkeer", value: stats.blocked },
        ].map((stat) => (
          <div key={stat.label} className="bg-ink-800 border border-ink-600 rounded-lg px-5 py-4">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-1">{stat.label}</p>
            <p className="font-serif text-2xl text-parchment-100 tabular-nums">{loading ? "—" : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="animate-fade-up opacity-0 delay-300">
        <label htmlFor="user-search" className="sr-only">
          Soek gebruikers
        </label>
        <input
          id="user-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Soek op e-pos of naam…"
          className={[
            "w-full max-w-sm",
            "bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
            "border border-ink-500 rounded-md px-4 py-2.5 text-sm font-body",
            "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
            "transition-colors duration-200",
          ].join(" ")}
        />
      </div>

      <section aria-labelledby="users-table-heading" className="animate-fade-up opacity-0 delay-400">
        <div className="flex items-baseline justify-between mb-4">
          <SectionLabel>Alle gebruikers</SectionLabel>
          <span className="font-sans text-xs text-parchment-600 tabular-nums">
            {displayed.length} / {users.length}
          </span>
        </div>

        {error && (
          <div className="mb-4 px-5 py-3 bg-rose/10 border border-rose/20 rounded-lg">
            <p className="font-sans text-xs text-rose">{error}</p>
          </div>
        )}

        <div className="border border-ink-600 rounded-lg overflow-hidden overflow-x-auto">
          {loading ? (
            <TableSkeleton />
          ) : displayed.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-body text-sm text-parchment-600">
                {search ? "Geen gebruikers pas die soekterm nie." : "Geen gebruikers nie."}
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-ink-600 bg-ink-800">
                  <th className={thClass} onClick={() => toggleSort("email")}>
                    E-pos{sortIndicator("email")}
                  </th>
                  <th className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600 hidden md:table-cell">
                    Naam
                  </th>
                  <th className={`${thClass} hidden lg:table-cell`} onClick={() => toggleSort("created_at")}>
                    Aangemeld{sortIndicator("created_at")}
                  </th>
                  <th className={`${thClass} hidden lg:table-cell`} onClick={() => toggleSort("last_sign_in_at")}>
                    Laas aktief{sortIndicator("last_sign_in_at")}
                  </th>
                  <th className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600">
                    Rol / Status
                  </th>
                  <th className="py-3 px-5">
                    <span className="sr-only">Aksies</span>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-ink-900 divide-y divide-ink-600">
                {displayed.map((user) => (
                  <tr
                    key={user.id}
                    className={[
                      "group transition-colors duration-150",
                      user.blocked ? "bg-rose/5" : "hover:bg-ink-800/40",
                    ].join(" ")}
                  >
                    <td className="py-4 px-5 align-top">
                      <span className="font-body text-sm text-parchment-200 block truncate max-w-[180px]">
                        {user.email}
                      </span>
                      {user.id === currentUser?.id && (
                        <span className="font-sans text-2xs text-parchment-600">(jy)</span>
                      )}
                    </td>

                    <td className="py-4 px-5 align-top hidden md:table-cell">
                      <span className="font-body text-sm text-parchment-400 truncate block max-w-[140px]">
                        {user.full_name ?? <span className="text-parchment-700 italic">—</span>}
                      </span>
                    </td>

                    <td className="py-4 px-5 align-top hidden lg:table-cell">
                      <time className="font-sans text-xs text-parchment-600 tabular-nums whitespace-nowrap">
                        {formatDateShort(user.created_at)}
                      </time>
                    </td>

                    <td className="py-4 px-5 align-top hidden lg:table-cell">
                      <time className="font-sans text-xs text-parchment-600 tabular-nums whitespace-nowrap">
                        {user.last_sign_in_at ? (
                          formatDateShort(user.last_sign_in_at)
                        ) : (
                          <span className="text-parchment-700 italic">Nooit</span>
                        )}
                      </time>
                    </td>

                    <td className="py-4 px-5 align-top">
                      <RoleBadge isAdmin={user.is_admin} blocked={user.blocked} role={user.role} />
                    </td>

                    <td className="py-4 px-5 align-top">
                      <UserActions user={user} currentId={currentUser?.id ?? ""} onRefresh={load} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-ink-600">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <div className="h-3 bg-ink-700 rounded w-2/5 animate-pulse" />
          <div className="h-3 bg-ink-700 rounded w-1/5 animate-pulse hidden md:block" />
          <div className="h-3 bg-ink-700 rounded w-1/6 animate-pulse hidden lg:block" />
          <div className="h-4 bg-ink-700 rounded w-14 animate-pulse" />
          <div className="h-4 bg-ink-700 rounded w-24 animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );
}
