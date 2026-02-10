import { z } from 'zod';

export const ticketSchema = z
  .object({
    title: z.string().min(5, 'Subjek laporan minimal 5 karakter'),
    description: z.string().min(10, 'Detail masalah minimal 10 karakter'),
    status: z.enum(['open', 'process', 'closed']),

    // Array foto utama (saat create)
    images: z.array(z.string()).max(5, 'Maksimal 5 foto lampiran').optional(),

    // Field tambahan untuk Update/History
    historyNote: z.string().optional(),
    assignedUser: z.string().optional(),
    // Array foto bukti update
    historyImages: z
      .array(z.string())
      .max(5, 'Maksimal 5 foto update')
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validasi Update (sama seperti sebelumnya)
    if (data.status !== 'open') {
      if (!data.historyNote || data.historyNote.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Wajib diisi untuk update status (min. 5 karakter)',
          path: ['historyNote'],
        });
      }
      if (!data.assignedUser || data.assignedUser.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nama teknisi/PIC wajib dipilih',
          path: ['assignedUser'],
        });
      }
    }
  });

export type TicketFormValues = z.infer<typeof ticketSchema>;
