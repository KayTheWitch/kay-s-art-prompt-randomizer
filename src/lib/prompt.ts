import { categories, type Category, type Lang } from "@/data/categories";
import { challengeExtras } from "@/data/extras";

export type Draw = { slug: Category["slug"]; picks: number[] };

export type Difficulty = "quick" | "study" | "challenge";
export const difficulties: Difficulty[] = ["quick", "study", "challenge"];

export type RNG = () => number;
const defaultRng: RNG = Math.random;
const rand = (n: number, rng: RNG = defaultRng) => Math.floor(rng() * n);

export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const optionKey = (slug: string, slotKey: string, index: number) =>
  `${slug}:${slotKey}:${index}`;

export function activeSlotCount(category: Category, difficulty: Difficulty): number {
  if (difficulty === "quick") return Math.min(2, category.slots.length);
  return category.slots.length;
}

type DrawOptions = {
  blocked?: ReadonlySet<string>;
  rng?: RNG;
};

function candidates(category: Category, index: number, blocked?: ReadonlySet<string>): number[] {
  const slot = category.slots[index]!;
  const all = slot.options.pt.map((_, i) => i);
  if (!blocked || blocked.size === 0) return all;
  const free = all.filter((i) => !blocked.has(optionKey(category.slug, slot.key, i)));
  return free.length > 0 ? free : all;
}

export function drawSlot(
  category: Category,
  index: number,
  { blocked, rng = defaultRng }: DrawOptions & { avoid?: number } = {},
  avoid?: number,
): number {
  const pool = candidates(category, index, blocked);
  const usable = pool.length > 1 && avoid !== undefined ? pool.filter((i) => i !== avoid) : pool;
  return usable[rand(usable.length, rng)]!;
}

export function drawAll(
  category: Category,
  options: DrawOptions & { locks?: number[]; prev?: number[] } = {},
): number[] {
  const { locks = [], prev } = options;
  return category.slots.map((_, i) =>
    locks.includes(i) && prev?.[i] !== undefined ? prev[i]! : drawSlot(category, i, options),
  );
}

export function reroll(
  category: Category,
  picks: number[],
  index: number,
  options: DrawOptions = {},
): number[] {
  if (!category.slots[index]) return picks;
  const next = drawSlot(category, index, options, picks[index]);
  return picks.map((p, i) => (i === index ? next : p));
}

export function randomCategory(rng: RNG = defaultRng): Category {
  return categories[rand(categories.length, rng)]!;
}

const optionsOf = (category: Category, index: number, lang: Lang = "pt") =>
  category.slots[index]?.options[lang] ?? [];

export function slotValues(category: Category, picks: number[], lang: Lang): string[] {
  return category.slots.map((_, i) => {
    const opts = optionsOf(category, i, lang);
    return opts[picks[i] ?? 0] ?? opts[0]!;
  });
}

/** Restrição extra determinística: mesma combinação de picks → mesma restrição. */
export function extraFor(category: Category, picks: number[], lang: Lang): string {
  const index = hashString(`${category.slug}:${picks.join("-")}`) % challengeExtras.length;
  return challengeExtras[index]![lang];
}

export function toSentence(
  category: Category,
  picks: number[],
  lang: Lang,
  options: { limit?: number; extra?: string } = {},
): string {
  const limit = options.limit ?? category.slots.length;
  const parts = category.slots.slice(0, limit).map((s, i) => {
    const opts = s.options[lang];
    const value = opts[picks[i] ?? 0] ?? opts[0]!;
    return s.prefix ? `${s.prefix[lang]} ${value}` : value;
  });
  if (options.extra) parts.push(options.extra);
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

/** Data UTC em YYYY-MM-DD. */
export function todayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Prompt do dia: determinístico a partir da data (igual para todo mundo). */
export function dailyDraw(dayKey: string): { category: Category; picks: number[] } {
  const rng = mulberry32(hashString(`kay-daily:${dayKey}`));
  const category = randomCategory(rng);
  const picks = category.slots.map((_, i) => drawSlot(category, i, { rng }));
  return { category, picks };
}
