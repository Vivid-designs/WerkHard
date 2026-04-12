import Link from "next/link";
import PostCard from "@/components/ui/PostCard";
import type { Post } from "@/lib/types";

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section
      aria-labelledby="featured-heading"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Section header */}
      <div
        className="container-wide"
        style={{ paddingTop: "4rem" }}
      >
        <header className="section-header">
          <div>
            <p className="mono-label" style={{ marginBottom: "0.5rem" }}>
              No. 01 — Nuutste skrywes
            </p>
            <h2
              id="featured-heading"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 700,
                fontSize: "1.6rem",
                color: "var(--text)",
                lineHeight: 1.2,
              }}
            >
              Onlangse Essays
            </h2>
          </div>
          <Link href="/skryf" className="hidden sm:inline-block archive-link">
            Al my skrywes →
          </Link>
        </header>
      </div>

      {/* Editorial grid — border colour shows through 1px gap */}
      <div
        className="container-wide reveal"
        style={{
          paddingBottom: "4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: posts.length >= 3 ? "1.45fr 1fr 1fr" : "1fr 1fr",
            background: "var(--border)",
            gap: "1px",
          }}
        >
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {/* Mobile archive link */}
        <div className="mt-8 flex sm:hidden">
          <Link href="/skryf" className="archive-link">
            Blaai deur alle essays →
          </Link>
        </div>
      </div>
    </section>
  );
}
