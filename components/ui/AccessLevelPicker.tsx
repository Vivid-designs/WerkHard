"use client";

import type { AccessLevel } from "@/lib/types";
import { ACCESS_LEVEL_LABELS } from "@/lib/types";

const LEVELS: AccessLevel[] = ["public", "members", "super_lario", "admin_only"];

interface AccessLevelPickerProps {
  value: AccessLevel;
  onChange: (level: AccessLevel) => void;
}

export default function AccessLevelPicker({ value, onChange }: AccessLevelPickerProps) {
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Toegangsvlak">
      {LEVELS.map((level) => (
        <label key={level} className="flex items-start gap-3 cursor-pointer group">
          <button
            type="button"
            role="radio"
            aria-checked={value === level}
            onClick={() => onChange(level)}
            className={[
              "mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
              value === level
                ? "border-parchment-400 bg-parchment-400"
                : "border-ink-500 bg-ink-800 hover:border-ink-400",
            ].join(" ")}
          />
          <span className="font-body text-sm text-parchment-400 group-hover:text-parchment-300 transition-colors duration-200 leading-snug">
            {ACCESS_LEVEL_LABELS[level]}
          </span>
        </label>
      ))}
    </div>
  );
}
