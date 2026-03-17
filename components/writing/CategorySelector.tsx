"use client";

import type { Category } from "@/lib/writing-service";

interface CategorySelectorProps {
  categories: Category[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function CategorySelector({ categories, selected, onChange }: CategorySelectorProps) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Kategorieë">
      {categories.map((cat) => {
        const active = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggle(cat.id)}
            aria-pressed={active}
            className={[
              "tag border transition-all duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
              active
                ? cat.accent
                : "text-parchment-500 bg-transparent border-ink-500 hover:border-parchment-500 hover:text-parchment-400",
            ].join(" ")}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
