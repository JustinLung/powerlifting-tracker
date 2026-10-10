import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-title font-semibold">Create your account</h1>
        <p className="text-small text-muted">Track your training or coach your athletes.</p>
      </div>
      <SignUpForm />
    </Card>
  );
}
