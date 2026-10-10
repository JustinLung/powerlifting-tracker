import type { ActivityItem, ActivityKind } from "@/lib/dashboard/types";
import { formatRelative } from "@/lib/domain/format";
import { IconTile, type IconName } from "./icons";
import { Widget, WidgetEmpty } from "./widget";

const icons: Record<ActivityKind, IconName> = {
  video_uploaded: "videos",
  feedback_given: "feedback",
  program_updated: "program",
  session_completed: "check",
  results_logged: "bar",
};

export function ActivityFeed({ items, now }: { items: ActivityItem[]; now: Date }) {
  return (
    <Widget id="activity" title="Recent activity" viewAll={{ href: null }}>
      {items.length === 0 ? (
        <WidgetEmpty message="Activity from your training will show up here." />
      ) : (
        <ol className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <IconTile name={icons[item.kind]} />
              <div className="min-w-0 flex-1">
                <p className="text-small font-semibold">{item.title}</p>
                <p className="line-clamp-2 text-caption text-muted">{item.detail}</p>
              </div>
              <time dateTime={item.at} className="shrink-0 text-caption text-subtle">
                {formatRelative(item.at, now)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </Widget>
  );
}
