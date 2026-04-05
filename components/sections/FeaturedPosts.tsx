import Link from "next/link";
import PostCard from "@/components/ui/PostCard";
import type { Post } from "@/lib/types";

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section aria-labelledby="featured-heading" className="border-b border-ink-700">
      <div className="container-narrow section-spacing">
        <header className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">
              Uitgesoekte skryfwerk
            </p>
            <h2
              id="featured-heading"
              className="font-serif text-display-md text-parchment-100"
            >
              Onlangse essays
            </h2>
          </div>
          <Link
            href="/skryf"
            className="hidden sm:inline-flex font-sans text-xs tracking-wide text-parchment-500 hover:text-parchment-200 transition-colors duration-200 items-center gap-2"
          >
            Alle essays <span aria-hidden="true" className="text-parchment-600">→</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/skryf"
            className="font-sans text-xs tracking-wide text-parchment-500 hover:text-parchment-200 transition-colors duration-200 underline underline-offset-4 decoration-parchment-600"
          >
            Blaai deur alle essays →
          </Link>
        </div>
      </div>
    </section>
  );
}
