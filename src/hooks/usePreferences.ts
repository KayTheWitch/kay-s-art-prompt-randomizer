import { useCallback, useEffect, useMemo, useState } from "react";
import type { Difficulty } from "@/lib/prompt";

export type Preferences = {
  difficulty: Difficulty;
  locks: Record<string, number[]>;
  blocked: string[];
};

const KEY = "kay-prompts:prefs:v1";

const empty: Preferences = { difficulty: "study", locks: {}, blocked: [] };

function read(): Preferences {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      difficulty:
        parsed.difficulty === "quick" || parsed.difficulty === "challenge"
          ? parsed.difficulty
          : "study",
      locks: typeof parsed.locks === "object" && parsed.locks ? parsed.locks : {},
      blocked: Array.isArray(parsed.blocked) ? parsed.blocked : [],
    };
  } catch {
    return empty;
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Preferences) => {
    setPrefs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage indisponível */
    }
  }, []);

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => persist({ ...read(), difficulty }),
    [persist],
  );

  const toggleLock = useCallback(
    (slug: string, index: number) => {
      const current = read();
      const list = current.locks[slug] ?? [];
      const next = list.includes(index) ? list.filter((i) => i !== index) : [...list, index];
      persist({ ...current, locks: { ...current.locks, [slug]: next } });
    },
    [persist],
  );

  const toggleBlocked = useCallback(
    (key: string) => {
      const current = read();
      const next = current.blocked.includes(key)
        ? current.blocked.filter((k) => k !== key)
        : [...current.blocked, key];
      persist({ ...current, blocked: next });
    },
    [persist],
  );

  const clearBlocked = useCallback(() => persist({ ...read(), blocked: [] }), [persist]);

  const blockedSet = useMemo(() => new Set(prefs.blocked), [prefs.blocked]);

  return {
    prefs,
    hydrated,
    blockedSet,
    setDifficulty,
    toggleLock,
    toggleBlocked,
    clearBlocked,
  };
}
