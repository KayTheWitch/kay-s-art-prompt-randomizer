import { createFileRoute, Link } from "@tanstack/react-router";
import { Ban, Bookmark, BookmarkCheck, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSavedPrompts, type SavedPrompt } from "@/hooks/useSavedPrompts";
import { usePreferences } from "@/hooks/usePreferences";
import { categories, categoryBySlug } from "@/data/categories";
import { toSentence } from "@/lib/prompt";
import { useI18n } from "@/i18n/LanguageProvider";
import { accentText } from "@/lib/accents";

const description =
  "Seus prompts de desenho favoritados e o histórico dos últimos sorteios. Your favorite drawing prompts and recent shuffles.";

export const Route = createFileRoute("/salvos")({
  head: () => ({
    meta: [
      { title: "Favoritos e histórico de prompts | Kay's Art Prompt Maker" },
      { name: "description", content: description },
      { property: "og:title", content: "Favoritos e histórico de prompts | Kay's Art Prompt Maker" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SalvosPage,
});

function SalvosPage() {
  const { items, hydrated, toggleFavorite, remove, clearHistory } = useSavedPrompts();
  const { prefs, blockedSet, toggleBlocked, clearBlocked } = usePreferences();
  const { lang, t, tl } = useI18n();

  const blockedList = prefs.blocked
    .map((key) => {
      const [slug, slotKey, raw] = key.split(":");
      const category = categories.find((c) => c.slug === slug);
      const slot = category?.slots.find((s) => s.key === slotKey);
      const index = Number.parseInt(raw ?? "", 10);
      const label = slot?.options[lang][index];
      return label ? { key, label, category: category! } : null;
    })
    .filter((v): v is { key: string; label: string; category: (typeof categories)[number] } => !!v);
  const favorites = items.filter((i) => i.favorite);
  const history = items.filter((i) => !i.favorite);

  const textOf = (item: SavedPrompt) => {
    const category = categoryBySlug(item.slug);
    if (!category) return item.text;
    return toSentence(category, item.picks, lang);
  };

  const list = (title: string, data: SavedPrompt[], empty: string) => (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      {data.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((item) => {
            const category = categoryBySlug(item.slug);
            return (
              <li key={item.id} className="rounded-3xl bg-card p-4 toon">
                <div className="min-w-0 flex-1">
                  {category && (
                    <Link
                      to="/$categoria"
                      params={{ categoria: category.slug }}
                      search={{ p: item.picks.join("-") }}
                      className={`text-[0.68rem] font-bold uppercase tracking-[0.16em] ${accentText[category.accent]}`}
                    >
                      {tl(category.name)}
                    </Link>
                  )}
                  <p className="mt-1 font-display text-lg font-bold leading-snug sm:text-xl">
                    {textOf(item)}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    aria-label={t("favorite")}
                    onClick={() => toggleFavorite(item.id)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-background toon toon-press"
                  >
                    {item.favorite ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={t("copy")}
                    onClick={async () => {
                      await navigator.clipboard.writeText(textOf(item));
                      toast(t("promptCopied"));
                    }}
                    className="grid h-10 w-10 place-items-center rounded-full bg-background toon toon-press"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("delete")}
                    onClick={() => remove(item.id)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-background toon toon-press"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-4xl">{t("savedTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("savedSubtitle")}</p>

      {!hydrated ? (
        <p className="mt-10 text-sm text-muted-foreground">{t("loading")}</p>
      ) : (
        <>
          {list(t("favorites"), favorites, t("noFavorites"))}
          {list(t("history"), history, t("noHistory"))}
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="mt-6 min-h-11 w-full rounded-full bg-card px-3 py-2 text-sm font-bold toon toon-press sm:w-auto"
            >
              {t("clearHistory")}
            </button>
          )}

          <section className="mt-10">
            <h2 className="font-display text-2xl">{t("blockedTitle")}</h2>
            {blockedSet.size === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{t("noBlocked")}</p>
            ) : (
              <>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {blockedList.map((b) => (
                    <li key={b.key}>
                      <button
                        type="button"
                        aria-label={`${t("unblockWord")}: ${b.label}`}
                        onClick={() => toggleBlocked(b.key)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold toon toon-press"
                      >
                        <Ban className={`h-3.5 w-3.5 ${accentText[b.category.accent]}`} />
                        {b.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={clearBlocked}
                  className="mt-4 min-h-11 w-full rounded-full bg-card px-3 py-2 text-sm font-bold toon toon-press sm:w-auto"
                >
                  {t("clearBlocked")}
                </button>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
