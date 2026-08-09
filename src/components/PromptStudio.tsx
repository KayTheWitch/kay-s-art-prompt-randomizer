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
    <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="relative rounded-xl border border-border bg-card p-6 shadow-[3px_3px_0_0_var(--color-border)]">
          <span
            className={cn(
              "text-xs uppercase tracking-[0.18em]",
              accentText[category.accent],
            )}
          >
            {category.name}
          </span>
          <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{sentence}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => commit(drawAll(category))}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Dices className="h-4 w-4" />
              Sortear tudo
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
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
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
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
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Link2 className="h-4 w-4" />
              Link
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {category.slots.map((slot, index) => (
            <div
              key={slot.key}
              className={cn(
                "flex items-start justify-between gap-3 rounded-lg border border-border p-3",
                accentSoft[category.accent],
              )}
            >
              <div>
                <span className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {slot.label}
                </span>
                <p className="mt-0.5 text-sm">{slot.options[picks[index] ?? 0]}</p>
              </div>
              <button
                type="button"
                aria-label={`Re-sortear ${slot.label}`}
                onClick={() => commit(reroll(category, picks, index))}
                className="rounded-md border border-border bg-background p-1.5 transition-colors hover:bg-accent"
              >
                <RefreshCw className="h-3.5 w-3.5" />
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