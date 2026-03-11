import type { WritingCategory } from "@/lib/skryf-data";

export type PostStatus = "published" | "draft";

export interface AdminWriting {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: WritingCategory;
  status: PostStatus;
  publishedAt: string;
  readingTime: number;
}

export const mockWritingEntries: AdminWriting[] = [
  {
    id: "1",
    slug: "die-kuns-van-stadige-denke",
    title: "Die Kuns van Stadige Denke",
    excerpt:
      "Ons leef in 'n wêreld wat vinnige antwoorde beloon. Maar die beste idees het tyd nodig om te ryp word.",
    body: "",
    category: "Essay",
    status: "published",
    publishedAt: "2024-04-10",
    readingTime: 8,
  },
  {
    id: "2",
    slug: "wat-dissipline-regtig-beteken",
    title: "Wat Dissipline Regtig Beteken",
    excerpt:
      "Dissipline word dikwels verwar met straf. Maar in sy suiwerste vorm is dit 'n manier om vry te word.",
    body: "",
    category: "Essay",
    status: "published",
    publishedAt: "2024-03-22",
    readingTime: 6,
  },
  {
    id: "3",
    slug: "aantekening-oor-mislukking",
    title: "Aantekening oor Mislukking",
    excerpt:
      "Mislukking is nie die teenoorgestelde van sukses nie. Dit is die grond waarop sukses groei.",
    body: "",
    category: "Aantekening",
    status: "draft",
    publishedAt: "2024-02-03",
    readingTime: 3,
  },
  {
    id: "4",
    slug: "die-waarde-van-stilte",
    title: "Die Waarde van Stilte",
    excerpt:
      "In 'n era van konstante insette het stilte skaars geword. Maar dit is juis hier waar diep denke plaasvind.",
    body: "",
    category: "Nadenking",
    status: "draft",
    publishedAt: "2024-01-29",
    readingTime: 5,
  },
];

export const writingCategories: WritingCategory[] = [
  "Essay",
  "Aantekening",
  "Nadenking",
  "Idee",
  "Refleksie",
];
