import { z } from 'zod';

export const ticketTroubleSchema = z
  .object({
    // --- FIELD CREATE / GLOBAL ---
    title: z.string().min(1, 'Judul masalah wajib dipilih'),
    siteId: z.string().min(3, 'Site ID wajib diisi (min 3 karakter)'),
    description: z.string().optional(),
    status: z.enum(['open', 'process', 'closed']),
    priority: z.enum(['Critical', 'Major', 'Minor']).default('Minor'),

    // Technical fields
    startTime: z.string().min(1, 'Waktu kejadian (Start Time) wajib diisi'),
    runHours: z.string().optional(),
    statusTx: z.string().optional(),
    duration: z.string().optional(),

    // Reporters Awal
    reporters: z
      .array(z.string())
      .min(1, 'Minimal satu pelapor awal wajib dipilih'),
    images: z.array(z.string()).max(5).optional(),

    // --- FIELD UPDATE (EDIT MODE) ---
    // History Note & Reporters didefinisikan optional di awal,
    // tapi akan diperketat di superRefine jika status bukan 'open'
    historyNote: z.string().optional(),
    historyReporters: z.array(z.string()).optional(),
    historyImages: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    // LOGIKA VALIDASI EDIT MODE
    // Jika status bukan 'open' (artinya sedang proses update/closing), field update wajib diisi
    if (data.status !== 'open') {
      // 1. Validasi Catatan Pengerjaan
      if (!data.historyNote || data.historyNote.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Catatan pengerjaan wajib diisi detail (min. 5 karakter)',
          path: ['historyNote'],
        });
      }

      // 2. Validasi Teknisi Update
      if (!data.historyReporters || data.historyReporters.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Wajib memilih minimal satu teknisi/pelapor update',
          path: ['historyReporters'],
        });
      }
    }
  });

export type TicketTroubleFormValues = z.infer<typeof ticketTroubleSchema>;
