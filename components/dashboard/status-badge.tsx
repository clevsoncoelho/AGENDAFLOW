import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/lib/types";

const labels: Record<AppointmentStatus, string> = { scheduled: "Agendado", confirmed: "Confirmado", completed: "Concluído", cancelled: "Cancelado", no_show: "Não compareceu" };
const tones: Record<AppointmentStatus, "neutral" | "blue" | "green" | "amber" | "red"> = { scheduled: "neutral", confirmed: "blue", completed: "green", cancelled: "red", no_show: "amber" };

export function StatusBadge({ status }: { status: AppointmentStatus }) { return <Badge tone={tones[status]}>{labels[status]}</Badge>; }
