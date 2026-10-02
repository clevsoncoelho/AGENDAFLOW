import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-3xl border border-ink-100 bg-white shadow-card", className)}>{children}</section>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-center justify-between gap-4 px-6 py-5", className)}>{children}</div>;
}

export function CardTitle({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
  return (
    <div>
      {eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">{eyebrow}</p>}
      <h2 className="text-base font-bold text-ink-900">{children}</h2>
    </div>
  );
}
