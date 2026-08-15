import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, BookmarkCheck, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import { dailyDraw, encodePicks, extraFor, todayKey, toSentence } from "@/lib/prompt";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { SketchTimer } from "@/components/SketchTimer";
import { useI18n } from "@/i18n/LanguageProvider";
import { accentText } from "@/lib/accents";

const description =
  "Um prompt de desenho novo por dia, igual para todo mundo. A new drawing prompt every day, the same for everyone.";
const title = "Desafio do dia | Kay's Art Prompt Maker";

export const Route = createFileRoute("/desafio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DailyPage,
});

function DailyPage() {
  const { lang, t, tl } = useI18n();
  const [dayKey, setDayKey] = useState(() => todayKey());
  const { items, hydrated, record, toggleFavorite } = useSavedPrompts();

  useEffect(() => {
    setDayKey(todayKey());
  }, []);

  const { category, picks } = useMemo(() => dailyDraw(dayKey), [dayKey]);
  const sentence = toSentence(category, picks, lang, { extra: extraFor(category, picks, lang) });
  const id = `${category.slug}:${picks.join("-")}`;
  const saved = items.find((i) => i.id === id);

  useEffect(() => {
    if (!hydrated) return;
    record({ slug: category.slug, picks, text: sentence });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id, lang]);

  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(message);
    } catch {
      toast(t("copyFailed"), { description: value });
    }
  };

  const formattedDate = new Date(`${dayKey}T12:00:00Z`).toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-US",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <h1 className="font-display text-3xl sm:text-4xl">{t("daily")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {formattedDate} · {t("dailySubtitle")}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="rounded-3xl bg-card p-5 toon-lg sm:p-6">
            <span
              className={`text-xs font-bold uppercase tracking-[0.18em] ${accentText[category.accent]}`}
            >
              {tl(category.name)}
            </span>
            <p className="mt-3 font-display text-2xl font-bold leading-tight sm:text-4xl">
              {sentence}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={() => {
                  record({ slug: category.slug, picks, text: sentence });
                  toggleFavorite(id);
                  toast(saved?.favorite ? t("removedFromFavorites") : t("savedToFavorites"));
                }}
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
                    `${typeof window !== "undefined" ? window.location.origin : ""}/desafio`,
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

          <Link
            to="/$categoria"
            params={{ categoria: category.slug }}
            search={{ p: encodePicks(picks) }}
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-card px-4 py-2 text-sm font-bold toon toon-press"
          >
            {t("openCategory")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <aside className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{tl(category.description)}</p>
          <SketchTimer />
        </aside>
      </div>
    </div>
  );
}
