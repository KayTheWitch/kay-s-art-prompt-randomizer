import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Dices } from "lucide-react";
import { categories } from "@/data/categories";
import { accentBar, accentText } from "@/lib/accents";
import { drawAll, encodePicks, randomCategory } from "@/lib/prompt";

const description =
  "Sorteie temas de desenho por área: personagens, cenários, objetos e exercícios de estudo. Para artistas de arte tradicional e digital.";

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

  const surprise = () => {
    const category = randomCategory();
    navigate({
      to: "/$categoria",
      params: { categoria: category.slug },
      search: { p: encodePicks(drawAll(category)) },
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Prompts para desenhar hoje
      </p>
      <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] sm:text-6xl">
        Escolha uma temática e deixe o sorteio decidir o resto.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>

      <button
        type="button"
        onClick={surprise}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Dices className="h-4 w-4" />
        Sortear de qualquer área
      </button>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to="/$categoria"
            params={{ categoria: category.slug }}
            search={{ p: undefined }}
            className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-[3px_3px_0_0_var(--color-border)]"
          >
            <span className={`block h-1 w-10 rounded-full ${accentBar[category.accent]}`} />
            <h2 className={`mt-4 text-2xl ${accentText[category.accent]}`}>{category.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{category.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm">
              Sortear
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
