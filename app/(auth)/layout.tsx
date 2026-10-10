import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-10">
      <Link href="/" className="flex items-center gap-3 rounded-md">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-md bg-primary text-small font-semibold text-on-primary">
          PL
        </span>
        <span className="text-subtitle font-semibold">PowerLift</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
