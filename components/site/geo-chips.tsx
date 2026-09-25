import { cn } from "@/lib/utils";

/**
 * Geo is stored as a free-text string ("DE, GA, IA, IN, MO ..."), so it gets
 * split on commas / slashes / pipes into individual chips. Anything that
 * isn't a simple list (e.g. "Nationwide") just renders as a single chip.
 */
export function parseGeo(geo: string): string[] {
  return (geo ?? "")
    .split(/[,/|]+/)
    .map((g) => g.trim())
    .filter(Boolean);
}

export function GeoChips({
  geo,
  /** Cap how many chips render before collapsing into "+N". Omit for all. */
  limit,
  className,
}: {
  geo: string;
  limit?: number;
  className?: string;
}) {
  const all = parseGeo(geo);
  if (all.length === 0) return null;

  const shown = typeof limit === "number" ? all.slice(0, limit) : all;
  const hidden = all.length - shown.length;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((code) => (
        <span
          key={code}
          className="rounded-md border border-border bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground"
        >
          {code}
        </span>
      ))}
      {hidden > 0 && (
        <span
          className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
          title={all.join(", ")}
        >
          +{hidden}
        </span>
      )}
    </div>
  );
}
