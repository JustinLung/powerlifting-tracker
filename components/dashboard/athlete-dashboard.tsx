import { lastWeeks, recentChange, sumSeries } from "@/lib/dashboard/metrics";
import type { AthleteDashboardData, SeriesPoint } from "@/lib/dashboard/types";
import { formatKg } from "@/lib/domain/format";
import { ActivityFeed } from "./activity-feed";
import { AthleteProgress } from "./athlete-progress";
import { MetricCard } from "./metric-card";
import { QuickStats } from "./quick-stats";
import { TodaySessionWidget } from "./today-session";
import { TotalChart } from "./total-chart";
import { UpcomingList } from "./upcoming-list";
import { VideoList } from "./video-list";
import type { IconName } from "./icons";

/** Weeks of history the progress sparklines show. Only that slice is sent to the client. */
const SPARKLINE_WEEKS = 12;

function metricFor(label: string, series: SeriesPoint[], icon: IconName) {
  const { latest, change } = recentChange(series);
  return (
    <MetricCard
      key={label}
      label={label}
      value={latest === null ? null : formatKg(latest)}
      caption="1RM (est.)"
      icon={icon}
      change={change}
    />
  );
}

export function AthleteDashboard({ data, now }: { data: AthleteDashboardData; now: Date }) {
  const totalHistory = sumSeries(data.lifts.map((l) => l.e1rmHistory));
  // Athlete order: new coach feedback first, then newest upload.
  const videos = [...data.videos].sort(
    (a, b) =>
      Number(b.status === "new_feedback") - Number(a.status === "new_feedback") ||
      b.uploadedAt.localeCompare(a.uploadedAt),
  );

  return (
    <>
      <section aria-label="Strength overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.lifts.map((l) => metricFor(l.label, l.e1rmHistory, "bar"))}
        {metricFor("Total", totalHistory, "weight")}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.15fr)_minmax(0,0.95fr)]">
        <div className="flex flex-col gap-4 lg:col-span-2 xl:col-span-1">
          <TodaySessionWidget session={data.todaySession} />
          <AthleteProgress
            lifts={data.lifts.map((l) => ({
              ...l,
              e1rmHistory: lastWeeks(l.e1rmHistory, SPARKLINE_WEEKS),
              volumeHistory: lastWeeks(l.volumeHistory, SPARKLINE_WEEKS),
            }))}
            bodyweightHistory={lastWeeks(data.bodyweightHistory, SPARKLINE_WEEKS)}
            analyticsHref={null}
          />
        </div>
        <div className="flex flex-col gap-4">
          <TotalChart history={totalHistory} />
          <VideoList
            title="Latest videos"
            videos={videos}
            viewAllHref={null}
            emptyMessage="Upload a set from a session to get feedback from your coach."
          />
        </div>
        <div className="flex flex-col gap-4">
          <UpcomingList sessions={data.upcoming} viewAllHref={null} />
          <ActivityFeed items={data.activity} now={now} />
          <QuickStats stats={data.quickStats} bodyweightHistory={data.bodyweightHistory} />
        </div>
      </div>
    </>
  );
}
