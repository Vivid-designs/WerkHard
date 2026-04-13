import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { categoryColors } from "@/lib/placeholder-data";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const accentClass = categoryColors[post.category] ?? categoryColors.Essay;
  const isFeatured = index === 0;
  const num = String(index + 1).padStart(2, "0");
  const staggerClass = `stagger-${Math.min(index + 1, 5)}`;

  return (
    <article
      className={`post-card reveal ${staggerClass}`}
      style={{
        padding: "2.2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        borderLeft: isFeatured ? "2px solid var(--lavender)" : "none",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Top row: number + category + date */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "var(--muted)",
          }}
        >
          {num}
        </span>
        <span className={`tag ${accentClass}`}>
          {post.category}
        </span>
        <time
          dateTime={post.publishedAt}
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "var(--muted)",
            marginLeft: "auto",
          }}
        >
          {formatDateShort(post.publishedAt)}
        </time>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 700,
          fontSize: isFeatured ? "1.4rem" : "1.15rem",
          lineHeight: 1.25,
          color: "var(--text)",
        }}
      >
        <Link
          href={`/skryf/${post.slug}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {/* Stretch link to fill card */}
          <span style={{ position: "absolute", inset: 0 }} aria-hidden="true" />
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p
        style={{
          fontFamily: "var(--body)",
          fontSize: "0.9rem",
          lineHeight: 1.75,
          color: "var(--muted)",
          flex: 1,
        }}
      >
        {post.excerpt}
      </p>

      {/* Footer: "Lees verder" — colour lifts on .post-card:hover via CSS */}
      <footer>
        <span
          data-lees=""
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            transition: "color 0.2s",
          }}
        >
          Lees verder →
        </span>
      </footer>
    </article>
  );
}
