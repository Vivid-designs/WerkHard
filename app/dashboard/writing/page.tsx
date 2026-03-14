import type { Metadata } from "next";
import Link from "next/link";
import WritingManager from "@/components/writing/WritingManager";

export const metadata: Metadata = { title: "Skryfwerk bestuur" };

export default function DashboardWritingPage() {
  return (
    <div className="container-narrow py-12 md:py-16 flex flex-col gap-10">
      <div className="flex items-start justify-between animate-fade-up opacity-0 delay-100">
        <div>
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Admin / Skryf</p>
          <h1 className="font-serif text-display-md text-parchment-100">Skryfwerk</h1>
          <p className="font-body text-parchment-500 text-sm mt-2">
            Bestuur alle stukke, konsepte en gepubliseerde inhoud.
          </p>
        </div>
        <Link
          href="/dashboard/writing/new"
          className={[
            "font-sans text-sm tracking-wide",
            "bg-parchment-200 text-ink-900 border border-parchment-200",
            "hover:bg-parchment-100 rounded-md px-6 py-2.5",
            "transition-all duration-200 whitespace-nowrap",
          ].join(" ")}
        >
          + Nuwe stuk
        </Link>
      </div>

      <div className="animate-fade-up opacity-0 delay-200">
        <WritingManager />
      </div>
    </div>
  );
}
