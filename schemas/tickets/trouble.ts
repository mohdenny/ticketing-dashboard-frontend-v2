import { z } from 'zod';

export const troubleSchema = z
  .object({
    title: z.string().min(1, 'Judul masalah wajib dipilih'),
    siteId: z.string().min(3, 'Site ID wajib diisi'),
    description: z.string().optional(),
    priority: z.enum(['Critical', 'Major', 'Minor']).default('Minor'),

    startTime: z.string().min(1, 'Waktu kejadian wajib diisi'),
    runHours: z.string().optional(),
    statusTx: z.string().optional(),
    duration: z.string().optional(),

    reporters: z.array(z.string()).min(1, 'Pelapor awal wajib dipilih'),
    images: z.array(z.string()).default([]),

    status: z.enum(['open', 'process', 'closed']),

    updateDescription: z.string().optional(),
    updateReporters: z.array(z.string()).optional(),
    updateImages: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status !== 'open') {
      if (!data.updateDescription || data.updateDescription.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Deskripsi pengerjaan wajib diisi detail (min. 5 karakter)',
          path: ['updateDescription'],
        });
      }
      if (!data.updateReporters || data.updateReporters.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Teknisi yang mengerjakan update wajib dipilih',
          path: ['updateReporters'],
        });
      }
    }
  });

export type TroubleFormValues = z.infer<typeof troubleSchema>;
