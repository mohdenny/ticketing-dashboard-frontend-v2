import { z } from 'zod';

export const maintenanceSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  troubleSource: z.string().min(1, 'Trouble Source wajib dipilih'),
  broadcastExplanation: z.string().optional(),
  probableCause: z.string().optional(),

  // Field Baris Terpisah
  networkElement: z.string().optional(),
  statusTx: z.string().optional(),
  impactTx: z.string().optional(),
  estimasiDowntime: z.string().optional(),

  startTime: z.string().min(1, 'Start Time wajib diisi'),
  pic: z.string().min(1, 'PIC wajib dipilih'),
  impactCustomer: z.string().optional(),

  // Array string untuk menyimpan base64/url gambar
  images: z.array(z.string()).optional(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
