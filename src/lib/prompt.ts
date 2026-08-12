import { categories, type Category, type Lang } from "@/data/categories";

export type Draw = { slug: Category["slug"]; picks: number[] };

const rand = (n: number) => Math.floor(Math.random() * n);

const optionsOf = (category: Category, index: number, lang: Lang = "pt") =>
  category.slots[index]?.options[lang] ?? [];

export function drawAll(category: Category): number[] {
  return category.slots.map((s) => rand(s.options.pt.length));
}

export function reroll(category: Category, picks: number[], index: number): number[] {
  const slot = category.slots[index];
  if (!slot || slot.options.pt.length < 2) return picks;
  let next = rand(slot.options.pt.length);
  while (next === picks[index]) next = rand(slot.options.pt.length);
  return picks.map((p, i) => (i === index ? next : p));
}

export function randomCategory(): Category {
  return categories[rand(categories.length)]!;
}

export function slotValues(category: Category, picks: number[], lang: Lang): string[] {
  return category.slots.map((_, i) => {
    const opts = optionsOf(category, i, lang);
    return opts[picks[i] ?? 0] ?? opts[0]!;
  });
}

export function toSentence(category: Category, picks: number[], lang: Lang): string {
  const parts = category.slots.map((s, i) => {
    const opts = s.options[lang];
    const value = opts[picks[i] ?? 0] ?? opts[0]!;
    return s.prefix ? `${s.prefix[lang]} ${value}` : value;
  });
  const text = parts.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function encodePicks(picks: number[]): string {
  return picks.join("-");
}

export function decodePicks(category: Category, raw: string | undefined): number[] | null {
  if (!raw) return null;
  const parts = raw.split("-").map((n) => Number.parseInt(n, 10));
  if (parts.length !== category.slots.length) return null;
  if (
    parts.some(
      (n, i) => !Number.isInteger(n) || n! < 0 || n! >= (category.slots[i]?.options.pt.length ?? 0),
    )
  )
    return null;
  return parts as number[];
}
