import { createFileRoute, notFound } from "@tanstack/react-router";
import { categoryBySlug } from "@/data/categories";
import { decodePicks } from "@/lib/prompt";
import { PromptStudio } from "@/components/PromptStudio";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/$categoria")({
  validateSearch: (search: Record<string, unknown>) => ({
    p: typeof search["p"] === "string" ? (search["p"] as string) : undefined,
  }),
  loader: ({ params }) => {
    const category = categoryBySlug(params.categoria);
    if (!category) throw notFound();
    return {
      slug: category.slug,
      name: category.name.pt,
      nameEn: category.name.en,
      description: `${category.description.pt} ${category.description.en}`,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Categoria não encontrada — Kay's Art Prompt Maker" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} / ${loaderData.nameEn} — prompts de desenho | Kay's Art Prompt Maker`;
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
  const { tl } = useI18n();
  const category = categoryBySlug(categoria)!;
  const initial = decodePicks(category, p);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <h1 className="font-display text-3xl sm:text-4xl">{tl(category.name)}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{tl(category.tagline)}</p>
      <div className="mt-6 sm:mt-8">
        <PromptStudio key={category.slug} category={category} initialPicks={initial} />
      </div>
    </div>
  );
}
