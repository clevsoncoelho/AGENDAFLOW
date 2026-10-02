"use client";

import { X } from "lucide-react";

export function Modal({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/35 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="max-h-[92vh] w-full overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="modal-title" className="text-lg font-bold text-ink-900">{title}</h2>{description && <p className="mt-1 text-sm text-ink-500">{description}</p>}</div>
          <button onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-400 hover:bg-ink-50 hover:text-ink-800" aria-label="Fechar"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
