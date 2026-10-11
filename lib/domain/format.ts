const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

/** Weights are canonical kilograms (ADR-011). One decimal at most, so 222.5 stays 222.5 and 190 stays 190. */
export function formatKg(value: number): string {
  return `${number.format(value)} kg`;
}

/** Signed change with an explicit sign: "+2.5 kg", "-0.3 kg", "0 kg". */
export function formatKgDelta(value: number): string {
  if (value === 0) return "0 kg";
  return `${value > 0 ? "+" : "-"}${number.format(Math.abs(value))} kg`;
}

export function formatRpe(value: number | null): string {
  return value === null ? "—" : number.format(value);
}

export function formatRpeRange(min: number, max: number): string {
  return min === max ? number.format(min) : `${number.format(min)}–${number.format(max)}`;
}

export function formatSetsReps(sets: number, reps: number): string {
  return `${sets} × ${reps}`;
}

export function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// UTC so the server and the browser render the same string.
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
export const formatWeekday = (iso: string) => weekday.format(new Date(iso));
export const formatLongDate = (date: Date) => longDate.format(date);

/** "2h ago", "3d ago". Relative to `now`, which callers pass in so rendering stays deterministic. */
export function formatRelative(iso: string, now: Date): string {
  const minutes = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Up to two upper-case initials for an avatar: "Sam Athlete" -> "SA". */
export function formatInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** "48.2 MB". Decimal units, as file managers show them. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  if (bytes < 1_000_000_000) return `${number.format(bytes / 1_000_000)} MB`;
  return `${number.format(bytes / 1_000_000_000)} GB`;
}
