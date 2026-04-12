import type { Post, NavItem, SocialLink } from "./types";

// Future: replace with supabase.from('posts').select('*').eq('featured', true).limit(3)
export const featuredPosts: Post[] = [
  {
    id: "1",
    slug: "oor-die-hou-van-n-aantekeninge-boek",
    title: "Oor die Hou van 'n Aantekeninge-boek",
    excerpt:
      "Vir eeue het skrywers en denkers persoonlike argiewe gehou van gedeeltes wat hulle geraak het. Ek doen dieselfde, en dit het stilletjies verander hoe ek lees.",
    category: "Essay",
    publishedAt: "2024-03-12",
    readingTime: 7,
    featured: true,
    tags: ["skryf", "lees", "gewoonte"],
  },
  {
    id: "2",
    slug: "die-lang-siening-in-kort-sinne",
    title: "Die Lang Siening in Kort Sinne",
    excerpt:
      "Daar is 'n soort kompressie moontlik in baie kort prosa wat geen ander vorm heeltemal kan ewenaar nie. 'n Paar notas oor die vreemde krag van kortheid.",
    category: "Craft",
    publishedAt: "2024-02-28",
    readingTime: 5,
    featured: true,
    tags: ["skryfkuns", "prosa", "styl"],
  },
  {
    id: "3",
    slug: "sewe-winters-in-oslo",
    title: "Sewe Winters in Oslo",
    excerpt:
      "Elke Januarie keer ek terug na dieselfde stad, dieselfde grys lig oor die fjord. Teen nou ken ek dit goed genoeg om op te hou maak asof ek net 'n besoeker is.",
    category: "Travel",
    publishedAt: "2024-01-20",
    readingTime: 9,
    featured: true,
    tags: ["reis", "herinnering", "plek"],
  },
];

export const navItems: NavItem[] = [
  { label: "WerkHard", href: "/werkhard" },
  { label: "Skryf", href: "/skryf" },
  { label: "Fotos", href: "/fotos" },
  { label: "Oor My", href: "/about" },
];

export const footerNav: NavItem[] = [
  { label: "Tuis", href: "/" },
  { label: "WerkHard", href: "/werkhard" },
  { label: "Skryf", href: "/skryf" },
  { label: "Fotos", href: "/fotos" },
  { label: "Oor My", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "X (Twitter)", href: "https://x.com/Werk__Hard" },
  { label: "Instagram", href: "https://instagram.com/spencesa" },
  { label: "Spotify", href: "https://open.spotify.com" },
  { label: "Substack", href: "https://substack.com" },
];

export const categoryColors: Record<string, string> = {
  Essay: "text-rose     bg-rose/10     border-rose/20",
  Reflection: "text-lavender bg-lavender/10 border-lavender/20",
  Reading: "text-powder   bg-powder/10   border-powder/20",
  Craft: "text-sage     bg-sage/10     border-sage/20",
  Travel: "text-peach    bg-peach/10    border-peach/20",
  Journal: "text-cream    bg-cream/10    border-cream/20",
};
