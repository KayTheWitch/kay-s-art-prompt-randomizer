import { Lock } from "lucide-react";
import { difficulties, type Difficulty } from "@/lib/prompt";
import { useI18n } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { StringKey } from "@/i18n/strings";

const labels: Record<Difficulty, StringKey> = {
  quick: "difficultyQuick",
  study: "difficultyStudy",
  challenge: "difficultyChallenge",
};

export function DifficultyPicker({
  value,
  onChange,
  disabled,
  lockedCount = 0,
}: {
  value: Difficulty;
  onChange: (next: Difficulty) => void;
  disabled?: boolean;
  lockedCount?: number;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {t("difficulty")}
      </span>
      <div className="flex flex-1 gap-2">
        {difficulties.map((level) => (
          <button
            key={level}
            type="button"
            disabled={disabled}
            aria-pressed={value === level}
            onClick={() => onChange(level)}
            className={cn(
              "min-h-10 flex-1 rounded-full px-3 py-1.5 text-sm font-bold toon toon-press",
              value === level ? "bg-foreground text-background" : "bg-card",
            )}
          >
            {t(labels[level])}
          </button>
        ))}
      </div>
      {lockedCount > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold toon">
          <Lock className="h-3 w-3" />
          {lockedCount} {t("lockedCount")}
        </span>
      )}
    </div>
  );
}
