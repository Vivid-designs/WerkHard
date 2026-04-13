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
  description?: string;
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

export type UserRole = 'normal' | 'super_lario' | 'admin';

export type AccessLevel = 'public' | 'members' | 'super_lario' | 'admin_only';

export const ACCESS_LEVEL_LABELS: Record<AccessLevel, string> = {
  public:      'Publiek — almal (ook nie-aangemelde besoekers)',
  members:     'Lede — enige aangemelde gebruiker',
  super_lario: 'Super Lario Bros — eksklusief + admin',
  admin_only:  'Slegs admin — privaat / konsepvoorskou',
};
