import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { TextLink } from "@/components/ui/text-link";
import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyState } from "@/components/programs/empty-state";
import { ProgramsView } from "@/components/programs/programs-view";
import { getProgramsData, type ProgramsPreviewState } from "@/lib/programs/mock-data";
import type { DashboardRole } from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "Programs preview",
  robots: { index: false },
};

const states: ProgramsPreviewState[] = ["ready", "empty", "forbidden", "error"];

export default function ProgramsPreviewPage({ searchParams }: PageProps<"/programs-preview">) {
  // Sample data must never ship as a real page.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Suspense fallback={<ProgramsSkeleton />}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/programs-preview">["searchParams"] }) {
  const params = await searchParams;
  const role: DashboardRole = params.role === "coach" ? "coach" : "athlete";
  const state = states.find((s) => s === params.state) ?? "ready";
  // Throws for state=error, which the route's error boundary renders.
  const data = state === "forbidden" ? null : await getProgramsData(state);

  return (
    <AppShell role={role} flush>
      <div className="border-b border-border p-4">
        <Alert tone="warning" title="Sample data">
          Every block, session and number here is made up. Real data arrives with F-04 and F-05. Preview states:{" "}
          {states.map((s, i) => (
            <span key={s}>
              {i > 0 && " · "}
              <TextLink href={s === "ready" ? "?" : `?state=${s}`}>{s}</TextLink>
            </span>
          ))}
        </Alert>
      </div>
      {data === null ? (
        <div className="p-6">
          <Alert tone="danger" title="You don’t have access to this program">
            Ask the athlete’s coach or the program owner to share it with you.
          </Alert>
        </div>
      ) : data.blocks.length === 0 ? (
        <div className="p-6">
          <EmptyState title="No program blocks yet">Blocks you create or are assigned will appear here.</EmptyState>
        </div>
      ) : (
        <ProgramsView initialBlocks={data.blocks} canLog={role === "athlete"} />
      )}
    </AppShell>
  );
}

function ProgramsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading programs" className="flex min-h-dvh flex-col lg:flex-row">
      <div className="h-40 animate-pulse bg-surface motion-reduce:animate-none lg:h-dvh lg:w-72" />
      <div className="grid flex-1 content-start gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-lg bg-surface motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
