/**
 * Client-side form validation for the auth screens. UI feedback only.
 * The server must validate again once an auth backend exists (Q-004).
 */

// Placeholder: the real minimum is decided by the auth provider (Q-004).
export const MIN_PASSWORD_LENGTH = 8;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL.test(email)) return "Enter a valid email address.";
}

export function validateSignIn(values: { email: string; password: string }): FieldErrors<"email" | "password"> {
  return {
    email: validateEmail(values.email),
    password: values.password ? undefined : "Enter your password.",
  };
}

export function validateSignUp(values: {
  name: string;
  email: string;
  password: string;
}): FieldErrors<"name" | "email" | "password"> {
  return {
    name: values.name.trim() ? undefined : "Enter your name.",
    email: validateEmail(values.email),
    password:
      values.password.length >= MIN_PASSWORD_LENGTH
        ? undefined
        : `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  };
}

export function hasErrors(errors: FieldErrors<string>): boolean {
  return Object.values(errors).some(Boolean);
}
