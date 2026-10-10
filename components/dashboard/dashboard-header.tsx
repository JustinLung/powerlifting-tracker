import { formatInitials, formatLongDate } from "@/lib/domain/format";
import { Icon } from "./icons";

type Props = {
  title: string;
  subtitle: string;
  user: { name: string; roleLabel: string };
  today: Date;
};

export function DashboardHeader({ title, subtitle, user, today }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div>
        <h1 className="text-title font-semibold">{title}</h1>
        <p className="text-small text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-5">
        <p className="flex items-center gap-2 text-small text-muted">
          <Icon name="calendar" className="size-4" />
          <time dateTime={today.toISOString().slice(0, 10)}>{formatLongDate(today)}</time>
        </p>
        {/* No account menu yet: it needs auth (F-01). The profile renders as plain text until then. */}
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-surface-hover text-small font-semibold">
            {formatInitials(user.name)}
          </span>
          <div className="text-small leading-tight">
            <p className="font-semibold">{user.name}</p>
            <p className="text-caption text-muted">{user.roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
