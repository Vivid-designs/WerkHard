import type { Post, NavItem, SocialLink } from "./types";

// Future: replace with supabase.from('posts').select('*').eq('featured', true).limit(3)
export const featuredPosts: Post[] = [
  {
    id: "1",
    slug: "on-keeping-a-commonplace-book",
    title: "On Keeping a Commonplace Book",
    excerpt:
      "For centuries, writers and thinkers kept personal archives of passages that moved them. I've been doing the same, and it has quietly changed how I read.",
    category: "Essay",
    publishedAt: "2024-03-12",
    readingTime: 7,
    featured: true,
    tags: ["writing", "reading", "habit"],
  },
  {
    id: "2",
    slug: "the-long-view-in-short-sentences",
    title: "The Long View in Short Sentences",
    excerpt:
      "There's a kind of compression possible in very short prose that no other form can quite match. A few notes on the strange power of brevity.",
    category: "Craft",
    publishedAt: "2024-02-28",
    readingTime: 5,
    featured: true,
    tags: ["craft", "prose", "style"],
  },
  {
    id: "3",
    slug: "seven-winters-in-oslo",
    title: "Seven Winters in Oslo",
    excerpt:
      "Each January I return to the same city, the same grey light over the fjord. By now I know it well enough to stop pretending I'm just a visitor.",
    category: "Travel",
    publishedAt: "2024-01-20",
    readingTime: 9,
    featured: true,
    tags: ["travel", "memory", "place"],
  },
];

export const navItems: NavItem[] = [
  { label: "Essays", href: "/essays" },
  { label: "Journal", href: "/journal" },
  { label: "Reading", href: "/reading" },
  { label: "About", href: "/about" },
];

export const footerNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Essays", href: "/essays" },
  { label: "Journal", href: "/journal" },
  { label: "Reading", href: "/reading" },
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
];

export const socialLinks: SocialLink[] = [
  { label: "Twitter / X", href: "https://twitter.com" },
  { label: "Substack", href: "https://substack.com" },
  { label: "Goodreads", href: "https://goodreads.com" },
];

export const categoryColors: Record<string, string> = {
  Essay: "text-rose     bg-rose/10     border-rose/20",
  Reflection: "text-lavender bg-lavender/10 border-lavender/20",
  Reading: "text-powder   bg-powder/10   border-powder/20",
  Craft: "text-sage     bg-sage/10     border-sage/20",
  Travel: "text-peach    bg-peach/10    border-peach/20",
  Journal: "text-cream    bg-cream/10    border-cream/20",
};
