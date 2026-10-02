import Link from "next/link";
import { CalendarDays } from "lucide-react";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="AgendaFlow início">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-transform group-hover:rotate-6">
        <CalendarDays size={19} strokeWidth={2.4} />
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-ink-900"}`}>agenda<span className="text-brand-600">flow</span></span>
    </Link>
  );
}
