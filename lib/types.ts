export type PostCategory =
  | "Essay"
  | "Reflection"
  | "Reading"
  | "Craft"
  | "Travel"
  | "Journal";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  coverImage?: string;
  tags?: string[];
  // Future: author_id for Supabase join
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon?: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
