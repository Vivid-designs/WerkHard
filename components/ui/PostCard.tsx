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
  const delays = ["delay-100", "delay-200", "delay-300"];
  const delayClass = delays[index % delays.length];

  return (
    <article
      className={[
        "group relative flex flex-col",
        "bg-ink-800 border border-ink-600 rounded-lg p-7 md:p-8",
        "transition-all duration-300",
        "hover:border-ink-500 hover:shadow-card-hover",
        "animate-fade-up opacity-0",
        delayClass,
      ].join(" ")}
    >
      <span className={`tag border self-start mb-5 ${accentClass}`}>
        {post.category}
      </span>

      <h3 className="font-serif text-display-sm text-parchment-100 mb-3 leading-snug group-hover:text-white transition-colors duration-200">
        <Link href={`/posts/${post.slug}`} className="hover:no-underline focus-visible:outline-none">
          <span className="absolute inset-0 rounded-lg" aria-hidden="true" />
          {post.title}
        </Link>
      </h3>

      <p className="font-body text-parchment-400 text-sm leading-relaxed mb-6 flex-1">
        {post.excerpt}
      </p>

      <footer className="flex items-center gap-4 text-parchment-500 text-xs font-sans">
        <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime} min lees</span>
      </footer>

      <div
        className={[
          "absolute bottom-0 left-7 right-7 h-px",
          "scale-x-0 group-hover:scale-x-100",
          "transition-transform duration-300 origin-left opacity-60",
          `bg-current ${accentClass.split(" ")[0]}`,
        ].join(" ")}
        aria-hidden="true"
      />
    </article>
  );
}
