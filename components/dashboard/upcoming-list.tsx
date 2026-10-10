import type { UpcomingSession } from "@/lib/dashboard/types";
import { formatShortDate, formatWeekday } from "@/lib/domain/format";
import { ListRow } from "./dashboard-link";
import { Widget, WidgetEmpty, WidgetList } from "./widget";

export function UpcomingList({ sessions, viewAllHref }: { sessions: UpcomingSession[]; viewAllHref: string | null }) {
  return (
    <Widget id="upcoming" title="Upcoming" viewAll={{ href: viewAllHref }}>
      {sessions.length === 0 ? (
        <WidgetEmpty message="No upcoming sessions scheduled." />
      ) : (
        <WidgetList>
          {sessions.map((s) => (
            <li key={s.id}>
              <ListRow href={s.href}>
                <time
                  dateTime={s.date}
                  className="w-12 shrink-0 rounded-sm bg-surface-raised py-1 text-center text-caption leading-tight text-muted"
                >
                  <span className="block uppercase">{formatWeekday(s.date)}</span>
                  <span className="block font-semibold text-foreground">{formatShortDate(s.date)}</span>
                </time>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-semibold">{s.title}</span>
                  <span className="block truncate text-caption text-muted">
                    {s.athleteName && `${s.athleteName} · `}Week {s.weekNumber} · Day {s.dayNumber}
                  </span>
                </span>
              </ListRow>
            </li>
          ))}
        </WidgetList>
      )}
    </Widget>
  );
}
