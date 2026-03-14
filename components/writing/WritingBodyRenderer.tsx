interface WritingBodyRendererProps {
  body: string;
}

export default function WritingBodyRenderer({ body }: WritingBodyRendererProps) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="prose-writing">
      {paragraphs.map((paragraph, i) => {
        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={i} className="font-serif text-display-sm text-parchment-100 mt-10 mb-4">
              {paragraph.slice(3)}
            </h2>
          );
        }
        if (paragraph.startsWith("# ")) {
          return (
            <h2 key={i} className="font-serif text-display-md text-parchment-100 mt-12 mb-5">
              {paragraph.slice(2)}
            </h2>
          );
        }
        if (paragraph.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-rose/30 pl-5 my-6 font-serif italic text-parchment-400 text-base leading-relaxed"
            >
              {paragraph.slice(2)}
            </blockquote>
          );
        }

        return (
          <p key={i} className="font-body text-parchment-300 text-base md:text-lg leading-[1.85] mb-6">
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}
