import { getAgendaData } from "@/lib/agenda";
import { AgendaBoard } from "@/components/dashboard/agenda-board";

export default async function AgendaPage() {
  const data = await getAgendaData();
  return <AgendaBoard {...data} />;
}
