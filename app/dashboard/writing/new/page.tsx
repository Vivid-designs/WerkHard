import type { Metadata } from "next";
import WritingForm from "@/components/writing/WritingForm";
import { getAllCategories } from "@/lib/writing-service";

export const metadata: Metadata = { title: "Nuwe stuk" };

export default async function NewWritingPage() {
  const categories = await getAllCategories();

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mb-10 animate-fade-up opacity-0 delay-100">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Admin / Skryf</p>
        <h1 className="font-serif text-display-md text-parchment-100">Nuwe stuk skryf</h1>
      </div>

      <div className="animate-fade-up opacity-0 delay-200">
        <WritingForm mode="create" categories={categories} />
      </div>
    </div>
  );
}
