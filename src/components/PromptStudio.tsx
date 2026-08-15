import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Ban, Bookmark, BookmarkCheck, Copy, Dices, Link2, Lock, RefreshCw, Unlock } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/data/categories";
import {
  activeSlotCount,
  drawAll,
  encodePicks,
  extraFor,
  optionKey,
  reroll,
  toSentence,
} from "@/lib/prompt";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { usePreferences } from "@/hooks/usePreferences";
import { DifficultyPicker } from "@/components/DifficultyPicker";
import { SketchTimer } from "@/components/SketchTimer";
import { useI18n } from "@/i18n/LanguageProvider";
import { accentText, accentSoft } from "@/lib/accents";
import { cn } from "@/lib/utils";

export function PromptStudio({
  category,
  initialPicks,
}: {
  category: Category;
  initialPicks: number[] | null;
}) {
  const navigate = useNavigate();
  const { lang, t, tl } = useI18n();
  const { prefs, hydrated: prefsReady, blockedSet, setDifficulty, toggleLock, toggleBlocked } =
    usePreferences();
  const [picks, setPicks] = useState<number[]>(() => initialPicks ?? drawAll(category));
  const { items, hydrated, record, toggleFavorite } = useSavedPrompts();

  const locks = prefs.locks[category.slug] ?? [];
  const limit = activeSlotCount(category, prefs.difficulty);
  const extra = prefs.difficulty === "challenge" ? extraFor(category, picks, lang) : undefined;
  const sentence = toSentence(category, picks, lang, { limit, extra });
  const id = `${category.slug}:${picks.join("-")}`;
  const saved = items.find((i) => i.id === id);

  useEffect(() => {
    setPicks(initialPicks ?? drawAll(category));
  }, [category.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = useCallback(
    (next: number[]) => {
      setPicks(next);
      navigate({
        to: "/$categoria",
        params: { categoria: category.slug },
        search: { p: encodePicks(next) },
        replace: true,
      });
    },
    [category.slug, navigate],
  );

  const drawEverything = () =>
    commit(drawAll(category, { locks, prev: picks, blocked: blockedSet }));

  const rerollSlot = (index: number) =>
    commit(reroll(category, picks, index, { blocked: blockedSet }));

  const blockOption = (index: number) => {
    const slot = category.slots[index]!;
    const key = optionKey(category.slug, slot.key, picks[index] ?? 0);
    toggleBlocked(key);
    const nextBlocked = new Set(blockedSet);
    nextBlocked.add(key);
    commit(reroll(category, picks, index, { blocked: nextBlocked }));
    toast(t("blockedWord"));
  };

  const save = () => {
    record({ slug: category.slug, picks, text: sentence });
    if (saved) {
      toggleFavorite(saved.id);
      toast(saved.favorite ? t("removedFromFavorites") : t("savedToFavorites"));
      return;
    }
    toggleFavorite(id);
    toast(t("savedToFavorites"));
  };

  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(message);
    } catch {
      toast(t("copyFailed"), { description: value });
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    record({ slug: category.slug, picks, text: sentence });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id, lang, prefs.difficulty]);

  return (
    <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
      <div>
        <DifficultyPicker
          value={prefs.difficulty}
          onChange={setDifficulty}
          disabled={!prefsReady}
          lockedCount={locks.filter((i) => i < limit).length}
        />

        <div className="relative mt-4 rounded-3xl bg-card p-5 toon-lg sm:p-6">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-[0.18em]",
              accentText[category.accent],
            )}
          >
            {tl(category.name)}
          </span>
          <p className="mt-3 font-display text-2xl font-bold leading-tight sm:text-4xl">
            {sentence}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={drawEverything}
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-clay px-4 py-2 text-sm font-bold text-background toon toon-press sm:col-span-1"
            >
              <Dices className="h-4 w-4" />
              {t("drawEverything")}
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold toon toon-press"
            >
              {saved?.favorite ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {saved?.favorite ? t("favorited") : t("favorite")}
            </button>
            <button
              type="button"
              onClick={() => copy(sentence, t("promptCopied"))}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold toon toon-press"
            >
              <Copy className="h-4 w-4" />
              {t("copy")}
            </button>
            <button
              type="button"
              onClick={() =>
                copy(
                  `${typeof window !== "undefined" ? window.location.origin : ""}/${category.slug}?p=${encodePicks(picks)}`,
                  t("linkCopied"),
                )
              }
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold toon toon-press sm:col-span-1"
            >
              <Link2 className="h-4 w-4" />
              {t("link")}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {category.slots.slice(0, limit).map((slot, index) => {
            const isLocked = locks.includes(index);
            const allBlocked = slot.options.pt.every((_, i) =>
              blockedSet.has(optionKey(category.slug, slot.key, i)),
            );
            return (
              <div
                key={slot.key}
                className={cn("rounded-2xl p-3 toon", accentSoft[category.accent])}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      {tl(slot.label)}
                      {isLocked && ` · ${t("locked")}`}
                    </span>
                    <p className="mt-0.5 text-sm">{slot.options[lang][picks[index] ?? 0]}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      aria-label={`${t("reroll")}: ${tl(slot.label)}`}
                      onClick={() => rerollSlot(index)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-background toon toon-press"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`${isLocked ? t("unlock") : t("lock")}: ${tl(slot.label)}`}
                      aria-pressed={isLocked}
                      onClick={() => toggleLock(category.slug, index)}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-full toon toon-press",
                        isLocked ? "bg-foreground text-background" : "bg-background",
                      )}
                    >
                      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      aria-label={`${t("block")}: ${slot.options[lang][picks[index] ?? 0]}`}
                      onClick={() => blockOption(index)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-background toon toon-press"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {allBlocked && (
                  <p className="mt-2 text-[0.7rem] text-muted-foreground">
                    {t("allBlockedWarning")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <aside className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{tl(category.description)}</p>
        <SketchTimer />
      </aside>
    </div>
  );
}
