import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { VideoItem } from "@/lib/dashboard/types";
import { formatDuration, formatShortDate } from "@/lib/domain/format";
import { ListRow } from "./dashboard-link";
import { Icon } from "./icons";
import { Widget, WidgetEmpty, WidgetList } from "./widget";

const status: Record<VideoItem["status"], { label: string; tone: BadgeTone }> = {
  awaiting_review: { label: "Awaiting review", tone: "warning" },
  new_feedback: { label: "New feedback", tone: "accent" },
  reviewed: { label: "Reviewed", tone: "neutral" },
};

type Props = {
  videos: VideoItem[];
  title: string;
  emptyMessage: string;
  viewAllHref: string | null;
};

/** Callers pass videos already ordered for the role (coach: unreviewed first; athlete: newest, new feedback first). */
export function VideoList({ videos, title, emptyMessage, viewAllHref }: Props) {
  return (
    <Widget id="videos" title={title} viewAll={{ href: viewAllHref }}>
      {videos.length === 0 ? (
        <WidgetEmpty message={emptyMessage} />
      ) : (
        <WidgetList>
          {videos.map((video) => (
            <li key={video.id}>
              <ListRow href={video.href}>
                {/* Thumbnails arrive with the upload feature (F-06); until then a neutral tile. */}
                <span aria-hidden="true" className="grid h-12 w-[4.5rem] shrink-0 place-items-center rounded-sm bg-surface-hover text-muted">
                  <Icon name="play" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-semibold">{video.exercise}</span>
                  <span className="block truncate text-caption text-muted">
                    {video.athleteName && `${video.athleteName} · `}
                    {formatShortDate(video.uploadedAt)}
                    {video.durationSeconds !== null && ` · ${formatDuration(video.durationSeconds)}`}
                  </span>
                </span>
                <Badge tone={status[video.status].tone}>{status[video.status].label}</Badge>
              </ListRow>
            </li>
          ))}
        </WidgetList>
      )}
    </Widget>
  );
}
