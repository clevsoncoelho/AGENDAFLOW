import { cn } from "@/lib/cn";

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "blue" | "green" | "amber" | "red"; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]",
      tone === "neutral" && "bg-ink-50 text-ink-500",
      tone === "blue" && "bg-brand-50 text-brand-700",
      tone === "green" && "bg-mint-50 text-mint-600",
      tone === "amber" && "bg-amber-50 text-amber-700",
      tone === "red" && "bg-red-50 text-red-600",
      className,
    )}>{children}</span>
  );
}
