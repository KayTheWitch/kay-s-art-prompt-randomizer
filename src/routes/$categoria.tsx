import { createFileRoute, notFound } from "@tanstack/react-router";
import { categoryBySlug } from "@/data/categories";
import { decodePicks } from "@/lib/prompt";
import { PromptStudio } from "@/components/PromptStudio";

export const Route = createFileRoute("/$categoria")({
  validateSearch: (search: Record<string, unknown>) => ({
    p: typeof search["p"] === "string" ? (search["p"] as string) : undefined,
  }),
  loader: ({ params }) => {
    const category = categoryBySlug(params.categoria);
    if (!category) throw notFound();
    return { slug: category.slug, name: category.name, description: category.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Categoria não encontrada — Risco Solto" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — prompts de desenho | Risco Solto`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoriaPage,
});

function CategoriaPage() {
  const { categoria } = Route.useParams();
  const { p } = Route.useSearch();
  const category = categoryBySlug(categoria)!;
  const initial = decodePicks(category, p);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl">{category.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{category.tagline}</p>
      <div className="mt-8">
        <PromptStudio key={category.slug} category={category} initialPicks={initial} />
      </div>
    </div>
  );
}