import { getDashboardData } from "@/lib/dashboard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { company, profile } = await getDashboardData();
  return <DashboardShell companyName={company?.name} profileName={profile?.full_name} profileRole={profile?.role}>{children}</DashboardShell>;
}
