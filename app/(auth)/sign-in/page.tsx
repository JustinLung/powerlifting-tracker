import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-title font-semibold">Sign in</h1>
        <p className="text-small text-muted">Welcome back. Pick up where you left off.</p>
      </div>
      <SignInForm />
    </Card>
  );
}
