import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 hover:-translate-y-0.5",
        variant === "secondary" && "bg-ink-900 text-white hover:bg-ink-800",
        variant === "outline" && "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50",
        variant === "ghost" && "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
        variant === "danger" && "bg-red-50 text-red-600 hover:bg-red-100",
        size === "sm" && "min-h-9 px-3 text-xs",
        size === "md" && "min-h-11 px-4 text-sm",
        size === "lg" && "min-h-13 px-6 text-base",
        className,
      )}
      {...props}
    />
  );
}
