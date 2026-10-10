import type { CoachDashboardData } from "@/lib/dashboard/types";
import { ActivityFeed } from "./activity-feed";
import { AttentionList } from "./attention-list";
import { MetricCard } from "./metric-card";
import { UpcomingList } from "./upcoming-list";
import { VideoList } from "./video-list";

/** Coach priorities: roster attention, videos awaiting review, feedback, then activity and upcoming. */
export function CoachDashboard({ data, now }: { data: CoachDashboardData; now: Date }) {
  const { counts } = data;
  // Unreviewed first, oldest first (FIFO review queue).
  const videos = [...data.videos].sort(
    (a, b) =>
      Number(b.status === "awaiting_review") - Number(a.status === "awaiting_review") ||
      a.uploadedAt.localeCompare(b.uploadedAt),
  );

  return (
    <>
      <section aria-label="Coaching overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active athletes" value={String(counts.activeAthletes)} caption="on your roster" icon="athletes" />
        <MetricCard label="Videos to review" value={String(counts.videosAwaitingReview)} caption="awaiting review" icon="videos" />
        <MetricCard label="Feedback to answer" value={String(counts.feedbackAwaiting)} caption="threads need a reply" icon="feedback" />
        <MetricCard label="Sessions completed" value={String(counts.sessionsCompleted7d)} caption="in the last 7 days" icon="check" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.15fr)_minmax(0,0.95fr)]">
        <div className="lg:col-span-2 xl:col-span-1">
          <AttentionList athletes={data.attention} rosterHref={null} />
        </div>
        <VideoList
          title="Videos awaiting review"
          videos={videos}
          viewAllHref={null}
          emptyMessage="Nothing to review. New uploads from your athletes will appear here."
        />
        <div className="flex flex-col gap-4">
          <UpcomingList sessions={data.upcoming} viewAllHref={null} />
          <ActivityFeed items={data.activity} now={now} />
        </div>
      </div>
    </>
  );
}
