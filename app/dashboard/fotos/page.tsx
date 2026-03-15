import type { Metadata } from "next";
import Link from "next/link";
import PhotoManager from "@/components/photos/PhotoManager";

export const metadata: Metadata = { title: "Foto bestuur" };

export default function DashboardFotosPage() {
  return (
    <div className="container-narrow py-12 md:py-16 flex flex-col gap-10">
      <div className="flex items-start justify-between animate-fade-up opacity-0 delay-100">
        <div>
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Admin / Fotos</p>
          <h1 className="font-serif text-display-md text-parchment-100">Foto-argief</h1>
          <p className="font-body text-parchment-500 text-sm mt-2">
            Bestuur foto-inskrywings, gallerye en gepubliseerde beelde.
          </p>
        </div>
        <Link
          href="/dashboard/fotos/new"
          className="font-sans text-sm bg-parchment-200 text-ink-900 border border-parchment-200 hover:bg-parchment-100 rounded-md px-6 py-2.5 transition-all duration-200 whitespace-nowrap"
        >
          + Nuwe foto
        </Link>
      </div>

      <div className="animate-fade-up opacity-0 delay-200">
        <PhotoManager />
      </div>
    </div>
  );
}
