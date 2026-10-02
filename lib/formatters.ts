import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDate(value: string | Date, pattern = "dd MMM, yyyy") {
  return format(new Date(value), pattern, { locale: ptBR });
}

export function formatTime(value: string | Date) {
  return format(new Date(value), "HH:mm", { locale: ptBR });
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
