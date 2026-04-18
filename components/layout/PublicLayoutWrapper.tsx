"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Footer from "./Footer";
import Header from "./Header";
import RevealObserver from "./RevealObserver";

const BYPASS_PREFIXES = ["/dashboard", "/login"];

export default function PublicLayoutWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isBypassRoute = BYPASS_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && !isBypassRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isBypassRoute, isLoading, router]);

  if (isBypassRoute) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <span className="block w-px h-8 bg-ink-600 animate-pulse" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      <RevealObserver />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
