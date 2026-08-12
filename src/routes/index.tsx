import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Dices } from "lucide-react";
import { categories } from "@/data/categories";
import { accentBar, accentText } from "@/lib/accents";
import { drawAll, encodePicks, randomCategory } from "@/lib/prompt";
import { useI18n } from "@/i18n/LanguageProvider";

const description =
  "Sorteie temas de desenho por área: personagens, cenários, objetos e exercícios de estudo. Para artistas de arte tradicional e digital. Shuffle drawing themes by area for traditional and digital artists.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Risco Solto — gerador de prompts de desenho" },
      { name: "description", content: description },
      { property: "og:title", content: "Risco Solto — gerador de prompts de desenho" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { t, tl } = useI18n();

  const surprise = () => {
    const category = randomCategory();
    navigate({
      to: "/$categoria",
      params: { categoria: category.slug },
      search: { p: encodePicks(drawAll(category)) },
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
        {t("homeKicker")}
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] sm:text-6xl">{t("homeTitle")}</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
        {t("homeDescription")}
      </p>

      <button
        type="button"
        onClick={surprise}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-clay px-5 py-2.5 text-base font-bold text-background toon-lg toon-press sm:w-auto"
      >
        <Dices className="h-5 w-5" />
        {t("drawAnyArea")}
      </button>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to="/$categoria"
            params={{ categoria: category.slug }}
            search={{ p: undefined }}
            className="group rounded-3xl bg-card p-5 toon toon-press sm:p-6"
          >
            <span
              className={`block h-2.5 w-14 rounded-full border-2 border-foreground ${accentBar[category.accent]}`}
            />
            <h2 className={`mt-4 text-2xl ${accentText[category.accent]}`}>{tl(category.name)}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{tl(category.tagline)}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold">
              {t("draw")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
