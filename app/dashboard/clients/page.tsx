import { getClients } from "@/lib/clients";
import { ClientsPage } from "@/components/dashboard/clients-page";

export default async function ClientsRoute() {
  return <ClientsPage clients={await getClients()} />;
}
