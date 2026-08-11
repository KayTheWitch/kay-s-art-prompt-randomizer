import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Copy, Dices, Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/data/categories";
import { drawAll, encodePicks, reroll, toSentence } from "@/lib/prompt";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { SketchTimer } from "@/components/SketchTimer";
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
  const [picks, setPicks] = useState<number[]>(() => initialPicks ?? drawAll(category));
  const { items, hydrated, record, toggleFavorite } = useSavedPrompts();

  const sentence = toSentence(category, picks);
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

  const save = () => {
    record({ slug: category.slug, picks, text: sentence });
    if (saved) {
      toggleFavorite(saved.id);
      toast(saved.favorite ? "Removido dos favoritos" : "Salvo nos favoritos");
      return;
    }
    toggleFavorite(id);
    toast("Salvo nos favoritos");
  };

  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(message);
    } catch {
      toast("Não consegui copiar aqui", { description: value });
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    record({ slug: category.slug, picks, text: sentence });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id]);

  return (
    <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="relative rounded-3xl bg-card p-5 toon-lg sm:p-6">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-[0.18em]",
              accentText[category.accent],
            )}
          >
            {category.name}
          </span>
          <p className="mt-3 font-display text-2xl font-bold leading-tight sm:text-4xl">
            {sentence}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={() => commit(drawAll(category))}
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-clay px-4 py-2 text-sm font-bold text-background toon toon-press sm:col-span-1"
            >
              <Dices className="h-4 w-4" />
              Sortear tudo
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
              {saved?.favorite ? "Favoritado" : "Favoritar"}
            </button>
            <button
              type="button"
              onClick={() => copy(sentence, "Prompt copiado")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold toon toon-press"
            >
              <Copy className="h-4 w-4" />
              Copiar
            </button>
            <button
              type="button"
              onClick={() =>
                copy(
                  `${typeof window !== "undefined" ? window.location.origin : ""}/${category.slug}?p=${encodePicks(picks)}`,
                  "Link copiado",
                )
              }
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold toon toon-press sm:col-span-1"
            >
              <Link2 className="h-4 w-4" />
              Link
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {category.slots.map((slot, index) => (
            <div
              key={slot.key}
              className={cn(
                "flex items-start justify-between gap-3 rounded-2xl p-3 toon",
                accentSoft[category.accent],
              )}
            >
              <div className="min-w-0">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {slot.label}
                </span>
                <p className="mt-0.5 text-sm">{slot.options[picks[index] ?? 0]}</p>
              </div>
              <button
                type="button"
                aria-label={`Re-sortear ${slot.label}`}
                onClick={() => commit(reroll(category, picks, index))}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background toon toon-press"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>
        <SketchTimer />
      </aside>
    </div>
  );
}