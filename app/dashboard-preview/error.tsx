"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-8">
      <Alert tone="danger" title="Couldn’t load the dashboard">
        Something went wrong while loading your training data.
      </Alert>
      <Button onClick={reset} variant="secondary" className="self-start">
        Try again
      </Button>
    </div>
  );
}
