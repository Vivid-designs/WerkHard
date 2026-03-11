// Future: replace exports with Supabase queries
// e.g. supabase.from('writing').select('*').order('published_at', { ascending: false })

export type WritingCategory =
  | "Essay"
  | "Aantekening"
  | "Nadenking"
  | "Idee"
  | "Refleksie";

export interface Writing {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: WritingCategory;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  featured: boolean;
  lang?: "af" | "en";
}

// ── Category accent colours ────────────────────────────────────────────────
// Extends the same categoryColors pattern from placeholder-data.ts
export const writingCategoryColors: Record<WritingCategory, string> = {
  Essay: "text-rose     bg-rose/10     border-rose/20",
  Aantekening: "text-powder   bg-powder/10   border-powder/20",
  Nadenking: "text-lavender bg-lavender/10 border-lavender/20",
  Idee: "text-sage     bg-sage/10     border-sage/20",
  Refleksie: "text-cream    bg-cream/10    border-cream/20",
};

// ── Placeholder entries ────────────────────────────────────────────────────
export const allWriting: Writing[] = [
  {
    id: "1",
    slug: "die-kuns-van-stadige-denke",
    title: "Die Kuns van Stadige Denke",
    excerpt:
      "Ons leef in 'n wêreld wat vinnige antwoorde beloon. Maar die beste idees — die soort wat werklik iets verander — het tyd nodig om te ryp word.",
    category: "Essay",
    publishedAt: "2024-04-10",
    readingTime: 8,
    featured: true,
    lang: "af",
  },
  {
    id: "2",
    slug: "wat-dissipline-regtig-beteken",
    title: "Wat Dissipline Regtig Beteken",
    excerpt:
      "Dissipline word dikwels verwar met straf of selfontkenning. Maar in sy suiwerste vorm is dit iets heel anders — 'n manier om vry te word.",
    category: "Essay",
    publishedAt: "2024-03-22",
    readingTime: 6,
    featured: true,
    lang: "af",
  },
  {
    id: "3",
    slug: "tegnologie-en-die-menslike-maat",
    title: "Tegnologie en die Menslike Maat",
    excerpt:
      "Elke nuwe instrument verander nie net wat ons doen nie — dit verander ook wie ons word. Die vraag is of ons bewus genoeg is om dit raak te sien.",
    category: "Essay",
    publishedAt: "2024-02-14",
    readingTime: 9,
    featured: false,
    lang: "af",
  },
  {
    id: "4",
    slug: "aantekening-oor-mislukking",
    title: "Aantekening oor Mislukking",
    excerpt:
      "Mislukking is nie die teenoorgestelde van sukses nie. Dit is die grond waarop sukses uiteindelik groei.",
    category: "Aantekening",
    publishedAt: "2024-02-03",
    readingTime: 3,
    featured: false,
    lang: "af",
  },
  {
    id: "5",
    slug: "die-waarde-van-stilte",
    title: "Die Waarde van Stilte",
    excerpt:
      "In 'n era van konstante insette het stilte skaars geword. Maar dit is juis in die stilte waar die diepste denke plaasvind.",
    category: "Nadenking",
    publishedAt: "2024-01-29",
    readingTime: 5,
    featured: false,
    lang: "af",
  },
  {
    id: "6",
    slug: "on-building-things-that-last",
    title: "On Building Things That Last",
    excerpt:
      "Most of what we make disappears. The rare thing that endures was usually built with a different intention from the start — not to impress, but to serve.",
    category: "Essay",
    publishedAt: "2024-01-15",
    readingTime: 7,
    featured: false,
    lang: "en",
  },
  {
    id: "7",
    slug: "idee-oor-gewoonte-en-identiteit",
    title: "Idee: Gewoonte is Identiteit",
    excerpt:
      "Jy word nie wie jy wil wees deur groot besluite nie. Jy word dit deur die klein dinge wat jy elke dag herhaal.",
    category: "Idee",
    publishedAt: "2023-12-18",
    readingTime: 2,
    featured: false,
    lang: "af",
  },
  {
    id: "8",
    slug: "refleksie-op-vyf-jaar",
    title: "Refleksie op Vyf Jaar Werk",
    excerpt:
      "Vyf jaar gelede het ek 'n besluit geneem wat alles verander het. Hierdie is wat ek geleer het — en wat ek anders sou doen.",
    category: "Refleksie",
    publishedAt: "2023-11-30",
    readingTime: 11,
    featured: false,
    lang: "af",
  },
  {
    id: "9",
    slug: "die-rol-van-geloof-in-my-lewe",
    title: "Die Rol van Geloof in My Lewe",
    excerpt:
      "Geloof is nie bloot 'n Sondagsaak nie. Dit is die lens waardeur ek elke besluit, uitdaging en oorwinning interpreteer.",
    category: "Nadenking",
    publishedAt: "2023-10-05",
    readingTime: 8,
    featured: false,
    lang: "af",
  },
];

export const featuredWriting = allWriting.filter((w) => w.featured);

// All unique categories present in the data — used for the filter UI
export const availableCategories: WritingCategory[] = Array.from(
  new Set(allWriting.map((w) => w.category)),
);
