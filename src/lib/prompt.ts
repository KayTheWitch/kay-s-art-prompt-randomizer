import { categories, type Category } from "@/data/categories";

export type Draw = { slug: Category["slug"]; picks: number[] };

const rand = (n: number) => Math.floor(Math.random() * n);

export function drawAll(category: Category): number[] {
  return category.slots.map((s) => rand(s.options.length));
}

export function reroll(category: Category, picks: number[], index: number): number[] {
  const slot = category.slots[index];
  if (!slot || slot.options.length < 2) return picks;
  let next = rand(slot.options.length);
  while (next === picks[index]) next = rand(slot.options.length);
  return picks.map((p, i) => (i === index ? next : p));
}

export function randomCategory(): Category {
  return categories[rand(categories.length)]!;
}

export function slotValues(category: Category, picks: number[]): string[] {
  return category.slots.map((s, i) => s.options[picks[i] ?? 0] ?? s.options[0]!);
}

export function toSentence(category: Category, picks: number[]): string {
  const parts = category.slots.map((s, i) => {
    const value = s.options[picks[i] ?? 0] ?? s.options[0]!;
    return s.prefix ? `${s.prefix} ${value}` : value;
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
      (n, i) => !Number.isInteger(n) || n! < 0 || n! >= (category.slots[i]?.options.length ?? 0),
    )
  )
    return null;
  return parts as number[];
}