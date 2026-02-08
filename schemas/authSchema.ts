import * as z from 'zod';

/**
 * AUTH SCHEMA
 * Digunakan untuk validasi login.
 * Standar Big Tech: Menambahkan .trim() dan custom error message.
 */
export const authSchema = z.object({
  // .trim() mencegah error karena spasi yang tidak sengaja terketik
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid')
    .trim()
    .toLowerCase(), // Standar normalisasi data

  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(6, 'Password minimal 6 karakter'),
});

// Memudahkan penggunaan di komponen dengan React Hook Form
export type AuthFormValues = z.infer<typeof authSchema>;
