import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoForm from "@/components/photos/PhotoForm";
import { getPhotoEntryById } from "@/lib/photo-service";

export const metadata: Metadata = { title: "Wysig foto" };

export default async function EditPhotoPage({ params }: { params: { id: string } }) {
  const entry = await getPhotoEntryById(params.id);
  if (!entry) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mb-10 animate-fade-up opacity-0 delay-100">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Admin / Fotos / Wysig</p>
        <h1 className="font-serif text-display-md text-parchment-100 truncate">{entry.title ?? entry.slug}</h1>
      </div>
      <div className="animate-fade-up opacity-0 delay-200">
        <PhotoForm mode="edit" initial={entry} />
      </div>
    </div>
  );
}
