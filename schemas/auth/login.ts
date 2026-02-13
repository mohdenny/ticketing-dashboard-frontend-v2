import * as z from 'zod';
export const authSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid')
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(6, 'Password minimal 6 karakter'),
});

export type AuthFormValues = z.infer<typeof authSchema>;
