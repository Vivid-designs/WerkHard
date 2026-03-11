"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/login");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <span className="block w-px h-8 bg-ink-600 animate-pulse" aria-hidden="true" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
