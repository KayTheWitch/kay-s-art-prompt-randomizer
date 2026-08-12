import type { Lang } from "@/data/categories";
import { useI18n } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const OPTIONS: Lang[] = ["pt", "en"];

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-card p-0.5 toon"
    >
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={cn(
            "min-h-9 rounded-full px-2.5 text-xs font-extrabold uppercase transition-colors",
            lang === option ? "bg-foreground text-background" : "hover:bg-accent",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
