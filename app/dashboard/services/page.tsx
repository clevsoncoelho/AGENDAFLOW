import { getServices } from "@/lib/services";
import { ServicesPage } from "@/components/dashboard/services-page";

export default async function ServicesRoute() {
  return <ServicesPage services={await getServices()} />;
}
