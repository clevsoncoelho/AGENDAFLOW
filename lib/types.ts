export type UserRole = "owner" | "admin" | "staff";
export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";

export type Company = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  primary_color: string;
  timezone: string;
};

export type Profile = {
  id: string;
  company_id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
};

export type DashboardMetric = {
  label: string;
  value: string;
  description: string;
  trend?: string;
  tone: "blue" | "mint" | "violet" | "amber";
};

export type Appointment = {
  id: string;
  client_name: string;
  service_name: string;
  staff_name: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  total_amount: number;
};
