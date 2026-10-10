import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { TextLink } from "@/components/ui/text-link";
import { AppShell } from "@/components/dashboard/app-shell";
import { AthleteDashboard } from "@/components/dashboard/athlete-dashboard";
import { CoachDashboard } from "@/components/dashboard/coach-dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getDashboardData } from "@/lib/dashboard/mock-data";
import type { DashboardRole } from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "Dashboard preview",
  robots: { index: false },
};

export default function DashboardPreviewPage({ searchParams }: PageProps<"/dashboard-preview">) {
  // Sample data must never ship as a real page.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/dashboard-preview">["searchParams"] }) {
  const params = await searchParams;
  await connection(); // the greeting, date and relative times depend on the request time
  const role: DashboardRole = params.role === "coach" ? "coach" : "athlete";
  const data = await getDashboardData(role);
  const now = new Date();

  return (
    <AppShell role={role}>
      <div className="mx-auto flex max-w-[96rem] flex-col gap-6">
        <Alert tone="warning" title="Sample data">
          Every number here is made up. Real data arrives with F-08.{" "}
          <TextLink href={role === "coach" ? "?role=athlete" : "?role=coach"}>
            View as {role === "coach" ? "athlete" : "coach"}
          </TextLink>
        </Alert>
        <DashboardHeader
          title={role === "coach" ? "Your athletes" : `Welcome back, ${data.user.name.split(" ")[0]}`}
          subtitle={role === "coach" ? "Who needs you today." : "Here’s what’s happening with your training today."}
          user={data.user}
          today={now}
        />
        {data.role === "coach" ? <CoachDashboard data={data} now={now} /> : <AthleteDashboard data={data} now={now} />}
      </div>
    </AppShell>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="p-8">
      <div className="h-8 w-64 animate-pulse rounded-md bg-surface motion-reduce:animate-none" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-surface motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
