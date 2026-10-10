"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { TextLink } from "@/components/ui/text-link";
import {
  MIN_PASSWORD_LENGTH,
  hasErrors,
  validateSignUp,
  type FieldErrors,
} from "@/lib/auth/validation";
import { PasswordInput } from "./password-input";
import { NotConnected } from "./not-connected";

type Errors = FieldErrors<"name" | "email" | "password">;

export function SignUpForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = validateSignUp({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
    setErrors(next);
    setSubmitted(!hasErrors(next));
    // TODO(F-01): call the sign-up action here once an auth backend is chosen (Q-004).
    // Role selection (athlete/coach) happens in onboarding, after sign-up (Q-019).
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {submitted && <NotConnected />}
      <Field label="Name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-description" : undefined}
        />
      </Field>
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
      <Field
        label="Password"
        htmlFor="password"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        error={errors.password}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          aria-invalid={errors.password ? true : undefined}
          aria-describedby="password-description"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full">
        Create account
      </Button>
      <p className="text-center text-small text-muted">
        Already have an account? <TextLink href="/sign-in">Sign in</TextLink>
      </p>
    </form>
  );
}
