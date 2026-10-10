"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { TextLink } from "@/components/ui/text-link";
import { hasErrors, validateSignIn, type FieldErrors } from "@/lib/auth/validation";
import { NotConnected } from "./not-connected";
import { PasswordInput } from "./password-input";

type Errors = FieldErrors<"email" | "password">;

export function SignInForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = validateSignIn({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
    setErrors(next);
    setSubmitted(!hasErrors(next));
    // TODO(F-01): call the sign-in action here once an auth backend is chosen (Q-004).
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {submitted && <NotConnected />}
      <Field label="Email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-description" : undefined}
        />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-description" : undefined}
        />
      </Field>
      {/* Password reset link goes here once F-01 builds that flow. */}
      <Button type="submit" size="lg" className="w-full">
        Sign in
      </Button>
      <p className="text-center text-small text-muted">
        New here? <TextLink href="/sign-up">Create an account</TextLink>
      </p>
    </form>
  );
}
