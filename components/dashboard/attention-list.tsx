import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { AthleteAttention, AttentionReason } from "@/lib/dashboard/types";
import { formatInitials, formatShortDate } from "@/lib/domain/format";
import { ListRow } from "./dashboard-link";
import { Widget, WidgetEmpty, WidgetList } from "./widget";

const reasons: Record<AttentionReason, { label: string; tone: BadgeTone }> = {
  missed_session: { label: "Missed session", tone: "warning" },
  rpe_overshoot: { label: "RPE above target", tone: "warning" },
  awaiting_review: { label: "Video awaiting review", tone: "accent" },
  no_program: { label: "No program", tone: "danger" },
};

export function AttentionList({ athletes, rosterHref }: { athletes: AthleteAttention[]; rosterHref: string | null }) {
  return (
    <Widget
      id="attention"
      title="Athletes needing attention"
      description="Sorted by what needs you first"
      viewAll={{ href: rosterHref, label: "All athletes" }}
    >
      {athletes.length === 0 ? (
        <WidgetEmpty
          message="Everyone is on track."
          action={rosterHref ? <ButtonLink href={rosterHref} variant="secondary" size="sm">View roster</ButtonLink> : undefined}
        />
      ) : (
        <WidgetList>
          {athletes.map((a) => (
            <li key={a.id}>
              <ListRow href={a.href}>
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-hover text-caption font-semibold">
                  {formatInitials(a.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-semibold">{a.name}</span>
                  <span className="block truncate text-caption text-muted">
                    {a.program ?? "No active program"}
                    {a.lastSessionAt && ` · last session ${formatShortDate(a.lastSessionAt)}`}
                  </span>
                </span>
                <Badge tone={reasons[a.reason].tone}>{reasons[a.reason].label}</Badge>
              </ListRow>
            </li>
          ))}
        </WidgetList>
      )}
    </Widget>
  );
}
