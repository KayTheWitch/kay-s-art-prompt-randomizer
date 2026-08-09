import type { Category } from "@/data/categories";

type Accent = Category["accent"];

export const accentText: Record<Accent, string> = {
  clay: "text-clay",
  moss: "text-moss",
  plum: "text-plum",
  ink: "text-ink",
};

export const accentSoft: Record<Accent, string> = {
  clay: "bg-clay/8",
  moss: "bg-moss/8",
  plum: "bg-plum/8",
  ink: "bg-ink/8",
};

export const accentBar: Record<Accent, string> = {
  clay: "bg-clay",
  moss: "bg-moss",
  plum: "bg-plum",
  ink: "bg-ink",
};