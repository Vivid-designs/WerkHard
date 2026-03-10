import Image from "next/image";

interface PortraitCardProps {
  src?: string;
  alt?: string;
  caption?: string;
  name?: string;
}

export default function PortraitCard({
  src,
  alt = "Portrait",
  caption = "Kaapstad, Suid-Afrika",
  name = "Lario",
}: PortraitCardProps) {
  return (
    <figure
      className={[
        "group relative flex flex-col",
        "animate-fade-up opacity-0 delay-200",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden rounded-lg",
          "border border-ink-600",
          "bg-ink-800",
          "transition-all duration-500 ease-gentle",
          "group-hover:-translate-y-1 group-hover:shadow-card-hover group-hover:border-ink-500",
          "aspect-[4/5] w-full",
        ].join(" ")}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <div
              className="absolute inset-0 opacity-[0.03]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 28px, #e4dfd4 28px, #e4dfd4 29px)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-5">
              <div
                className={[
                  "w-20 h-20 rounded-full",
                  "border border-ink-500",
                  "flex items-center justify-center",
                  "bg-ink-700",
                ].join(" ")}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  className="text-parchment-500"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-ink-500 to-transparent" />

              <span
                className="font-serif italic text-3xl text-parchment-600 select-none tracking-widest"
                aria-hidden="true"
              >
                L.
              </span>
            </div>

            {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
              (corner) => (
                <CornerOrnament key={corner} position={corner} />
              ),
            )}
          </div>
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 60%, rgba(12,12,11,0.35) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      <figcaption className="mt-4 flex flex-col gap-1.5 px-1">
        <span className="font-serif text-sm text-parchment-300">{name}</span>
        <span className="font-sans text-2xs tracking-widest uppercase text-parchment-500">
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

function CornerOrnament({ position }: { position: CornerPosition }) {
  const posClasses: Record<CornerPosition, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };
  const rotateClasses: Record<CornerPosition, string> = {
    "top-left": "",
    "top-right": "rotate-90",
    "bottom-left": "-rotate-90",
    "bottom-right": "rotate-180",
  };

  return (
    <svg
      className={`absolute ${posClasses[position]} ${rotateClasses[position]} text-ink-500 opacity-60`}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 13V1h12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
