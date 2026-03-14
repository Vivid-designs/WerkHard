import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WritingForm from "@/components/writing/WritingForm";
import { getWritingById, getAllCategories } from "@/lib/writing-service";

export const metadata: Metadata = { title: "Wysig stuk" };

export default async function EditWritingPage({ params }: { params: { id: string } }) {
  const [piece, categories] = await Promise.all([getWritingById(params.id), getAllCategories()]);

  if (!piece) notFound();

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mb-10 animate-fade-up opacity-0 delay-100">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Admin / Skryf / Wysig</p>
        <h1 className="font-serif text-display-md text-parchment-100 truncate">{piece.title}</h1>
      </div>

      <div className="animate-fade-up opacity-0 delay-200">
        <WritingForm mode="edit" initial={piece} categories={categories} />
      </div>
    </div>
  );
}
