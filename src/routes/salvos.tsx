import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { categoryBySlug } from "@/data/categories";
import { accentText } from "@/lib/accents";

export const Route = createFileRoute("/salvos")({
  head: () => ({
    meta: [
      { title: "Favoritos e histórico de prompts | Risco Solto" },
      {
        name: "description",
        content: "Seus prompts de desenho favoritados e o histórico dos últimos sorteios.",
      },
      { property: "og:title", content: "Favoritos e histórico de prompts | Risco Solto" },
      {
        property: "og:description",
        content: "Seus prompts de desenho favoritados e o histórico dos últimos sorteios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SalvosPage,
});

function SalvosPage() {
  const { items, hydrated, toggleFavorite, remove, clearHistory } = useSavedPrompts();
  const favorites = items.filter((i) => i.favorite);
  const history = items.filter((i) => !i.favorite);

  const list = (title: string, data: typeof items, empty: string) => (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      {data.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((item) => {
            const category = categoryBySlug(item.slug);
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  {category && (
                    <Link
                      to="/$categoria"
                      params={{ categoria: category.slug }}
                      search={{ p: item.picks.join("-") }}
                      className={`text-[0.68rem] uppercase tracking-[0.16em] ${accentText[category.accent]}`}
                    >
                      {category.name}
                    </Link>
                  )}
                  <p className="mt-1 font-display text-xl leading-snug">{item.text}</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Favoritar"
                    onClick={() => toggleFavorite(item.id)}
                    className="rounded-md border border-border p-2 transition-colors hover:bg-accent"
                  >
                    {item.favorite ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Copiar"
                    onClick={async () => {
                      await navigator.clipboard.writeText(item.text);
                      toast("Prompt copiado");
                    }}
                    className="rounded-md border border-border p-2 transition-colors hover:bg-accent"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Apagar"
                    onClick={() => remove(item.id)}
                    className="rounded-md border border-border p-2 transition-colors hover:bg-accent"
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Salvos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tudo fica guardado apenas neste navegador, sem cadastro.
      </p>

      {!hydrated ? (
        <p className="mt-10 text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <>
          {list("Favoritos", favorites, "Nenhum favorito ainda. Sorteie e clique em Favoritar.")}
          {list("Histórico", history, "Seus últimos sorteios aparecem aqui.")}
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="mt-6 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Limpar histórico
            </button>
          )}
        </>
      )}
    </div>
  );
}