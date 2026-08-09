import { useCallback, useEffect, useState } from "react";

export type SavedPrompt = {
  id: string;
  slug: string;
  picks: number[];
  text: string;
  at: number;
  favorite: boolean;
};

const KEY = "sketch-prompts:v1";
const MAX = 60;

function read(): SavedPrompt[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedPrompt[]) : [];
  } catch {
    return [];
  }
}

export function useSavedPrompts() {
  const [items, setItems] = useState<SavedPrompt[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SavedPrompt[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage indisponível */
    }
  }, []);

  const record = useCallback(
    (entry: Omit<SavedPrompt, "id" | "at" | "favorite">) => {
      const current = read();
      const id = `${entry.slug}:${entry.picks.join("-")}`;
      const existing = current.find((i) => i.id === id);
      const rest = current.filter((i) => i.id !== id);
      const next = [
        { ...entry, id, at: Date.now(), favorite: existing?.favorite ?? false },
        ...rest,
      ];
      const favorites = next.filter((i) => i.favorite);
      const history = next.filter((i) => !i.favorite).slice(0, MAX);
      persist([...favorites, ...history].sort((a, b) => b.at - a.at));
    },
    [persist],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      persist(read().map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)));
    },
    [persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(read().filter((i) => i.id !== id));
    },
    [persist],
  );

  const clearHistory = useCallback(() => {
    persist(read().filter((i) => i.favorite));
  }, [persist]);

  return { items, hydrated, record, toggleFavorite, remove, clearHistory };
}