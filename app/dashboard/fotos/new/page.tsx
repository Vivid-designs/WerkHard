import type { Metadata } from "next";
import PhotoForm from "@/components/photos/PhotoForm";

export const metadata: Metadata = { title: "Nuwe foto" };

export default function NewPhotoPage() {
  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mb-10 animate-fade-up opacity-0 delay-100">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Admin / Fotos / Nuut</p>
        <h1 className="font-serif text-display-md text-parchment-100">Nuwe foto-inskrywing</h1>
      </div>
      <div className="animate-fade-up opacity-0 delay-200">
        <PhotoForm mode="create" />
      </div>
    </div>
  );
}
