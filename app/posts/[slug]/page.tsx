import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredPosts } from "@/lib/placeholder-data";
import { formatDate } from "@/lib/utils";

interface PostPageProps {
  params: {
    slug: string;
  };
}

function getPostBySlug(slug: string) {
  return featuredPosts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return featuredPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: `${post.title} | WerkHard`,
    description: post.excerpt,
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container-narrow section-spacing">
      <Link
        href="/"
        className="font-sans text-xs uppercase tracking-[0.14em] text-parchment-500 hover:text-parchment-200"
      >
        ← Back to home
      </Link>

      <header className="mt-8 border-b border-ink-600 pb-8">
        <p className="tag border border-ink-500 text-parchment-300 mb-4">{post.category}</p>
        <h1 className="text-display-lg md:text-5xl leading-tight">{post.title}</h1>
        <p className="mt-4 text-parchment-400 max-w-2xl">{post.excerpt}</p>
        <p className="mt-5 text-sm text-parchment-500 font-sans">
          {formatDate(post.publishedAt)} · {post.readingTime} min read
        </p>
      </header>

      <div className="mt-10 prose prose-invert max-w-none text-parchment-300">
        <p>
          This is a scaffolded post page for <strong>{post.title}</strong>. Replace this placeholder
          copy with your full post body once your CMS/data source is connected.
        </p>
        <p>
          The route now resolves at <code>/posts/{post.slug}</code>, so featured post cards on the
          homepage navigate to valid pages instead of 404s.
        </p>
      </div>
    </article>
  );
}
