import { Link } from "@tanstack/react-router";
import { Bookmark, Shuffle } from "lucide-react";
import { categories } from "@/data/categories";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-foreground bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay toon">
              <Shuffle className="h-4 w-4 text-background" />
            </span>
            <span className="truncate font-display text-2xl font-extrabold">Risco Solto</span>
          </Link>
          <Link
            to="/salvos"
            activeProps={{ className: "bg-accent" }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-2 text-sm font-semibold toon toon-press"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Salvos</span>
          </Link>
        </div>
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/$categoria`}
              params={{ categoria: c.slug }}
              search={{ p: undefined }}
              activeProps={{ className: "bg-foreground text-background" }}
              className="shrink-0 rounded-full border-2 border-foreground bg-card px-3 py-1.5 font-semibold transition-colors hover:bg-accent"
            >
              {c.name.split(" ")[0]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}