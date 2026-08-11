import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "30s", seconds: 30 },
  { label: "2min", seconds: 120 },
  { label: "5min", seconds: 300 },
  { label: "10min", seconds: 600 },
  { label: "25min", seconds: 1500 },
];

function format(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SketchTimer() {
  const [duration, setDuration] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const endRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + remaining * 1000;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round(((endRef.current ?? 0) - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        toast("Tempo esgotado", { description: "Solte o lápis e olhe o desenho de longe." });
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const pick = useCallback((seconds: number) => {
    setRunning(false);
    setDuration(seconds);
    setRemaining(seconds);
  }, []);

  const progress = duration > 0 ? 1 - remaining / duration : 0;

  return (
    <div className="rounded-3xl bg-card p-4 toon">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <TimerIcon className="h-3.5 w-3.5" />
        Timer de sketch
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="font-display text-4xl font-extrabold tabular-nums">
          {format(remaining)}
        </span>
        <div className="flex flex-1 gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={remaining === 0}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-moss px-3 py-1.5 text-sm font-bold text-background toon toon-press disabled:opacity-40 sm:flex-none"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? "Pausar" : "Começar"}
          </button>
          <button
            type="button"
            onClick={() => pick(duration)}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-semibold toon toon-press sm:flex-none"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Zerar
          </button>
        </div>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full border-2 border-foreground bg-muted">
        <div
          className="h-full bg-clay transition-[width] duration-200"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.seconds}
            type="button"
            onClick={() => pick(p.seconds)}
            className={cn(
              "min-h-9 rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold transition-colors",
              duration === p.seconds
                ? "bg-foreground text-background"
                : "bg-background hover:bg-accent",
            )}
          >
            {p.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          min
          <input
            type="number"
            min={1}
            max={180}
            className="w-16 rounded-full border-2 border-foreground bg-background px-2 py-1 text-foreground"
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v) && v > 0) pick(Math.min(180, Math.round(v)) * 60);
            }}
          />
        </label>
      </div>
    </div>
  );
}