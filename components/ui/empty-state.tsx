import { CalendarX2, DatabaseZap } from "lucide-react";
import { Button } from "./button";

export function EmptyState({ title, description, action, setup = false }: { title: string; description: string; action?: { label: string; onClick?: () => void }; setup?: boolean }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        {setup ? <DatabaseZap size={24} /> : <CalendarX2 size={24} />}
      </div>
      <h3 className="text-sm font-bold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-500">{description}</p>
      {action && <Button className="mt-5" size="sm" onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
