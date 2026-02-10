import { z } from 'zod';

export const ticketSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Judul minimal 5 karakter' })
    .max(100, { message: 'Judul maksimal 100 karakter' })
    .trim(),
  description: z
    .string()
    .min(10, { message: 'Deskripsi minimal 10 karakter' })
    .trim(),
  status: z.enum(['open', 'process', 'closed']),
  image: z.string().nullable().optional(),
  // Field tambahan untuk log timeline saat update
  updateMessage: z
    .string()
    .min(5, { message: 'Penjelasan update minimal 5 karakter' })
    .optional(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
