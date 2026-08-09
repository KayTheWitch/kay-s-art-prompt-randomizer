import { Link } from "@tanstack/react-router";
import { Bookmark, Shuffle } from "lucide-react";
import { categories } from "@/data/categories";

export function SiteHeader() {
  return (
    <header className="border-b border-border/70">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Shuffle className="h-4 w-4 text-clay" />
          <span className="font-display text-xl">Risco Solto</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/$categoria`}
              params={{ categoria: c.slug }}
              activeProps={{ className: "text-foreground underline underline-offset-4" }}
              className="transition-colors hover:text-foreground"
            >
              {c.name.split(" ")[0]}
            </Link>
          ))}
        </nav>
        <Link
          to="/salvos"
          activeProps={{ className: "text-foreground" }}
          className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bookmark className="h-4 w-4" />
          Salvos
        </Link>
      </div>
    </header>
  );
}