import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Informe seu nome completo."),
  companyName: z.string().min(2, "Informe o nome da empresa."),
  companySlug: z
    .string()
    .min(3, "Use pelo menos 3 caracteres.")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen."),
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const bookingSchema = z.object({
  companySlug: z.string().min(1),
  serviceId: z.string().uuid("Selecione um serviço válido."),
  staffId: z.string().uuid("Selecione um profissional válido."),
  startsAt: z.string().datetime({ offset: true }),
  clientName: z.string().min(2, "Informe seu nome."),
  clientPhone: z.string().min(8, "Informe um telefone válido."),
  clientEmail: z.string().email("Digite um e-mail válido.").optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});
