'use client';

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, AuthFormValues } from '@/schemas/authSchema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    const toastId = toast.loading('Sedang memverifikasi...');
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        toast.error(result.message, { id: toastId });
      } else {
        toast.success('Selamat datang kembali!', { id: toastId });
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem', { id: toastId });
    }
  };

  return (
    // Memastikan kontainer bisa di-scroll di mobile (min-h-full)
    <div className="min-h-full w-full bg-[#F3EDF7] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Card Wrapper - Responsive Width */}
      <div className="w-full max-w-[400px] bg-white rounded-[28px] p-6 md:p-10 border border-[#E6E0E9] shadow-sm my-auto">
        {/* Logo/Icon Wrapper */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#EADDFF] rounded-[20px] flex items-center justify-center text-[#21005D] mb-4 shadow-sm">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#1C1B1F] tracking-tight text-center">
            Login
          </h1>
          <p className="text-sm text-[#49454F] mt-2 text-center leading-relaxed">
            Ticketing System Dashboard
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Field Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#49454F] group-focus-within:text-[#6750A4] transition-colors">
                      <Mail size={20} />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Alamat Email"
                        {...field}
                        className="pl-12 h-14 rounded-2xl border-[#79747E] focus-visible:ring-2 focus-visible:ring-[#6750A4] focus-visible:border-none bg-transparent w-full text-base"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs font-medium ml-2 text-[#B3261E]" />
                </FormItem>
              )}
            />

            {/* Field Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#49454F] group-focus-within:text-[#6750A4] transition-colors">
                      <Lock size={20} />
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Kata Sandi"
                        {...field}
                        className="pl-12 h-14 rounded-2xl border-[#79747E] focus-visible:ring-2 focus-visible:ring-[#6750A4] focus-visible:border-none bg-transparent w-full text-base"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs font-medium ml-2 text-[#B3261E]" />
                </FormItem>
              )}
            />

            {/* Submit Button - Tetap Full Width */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#6750A4] text-white h-14 rounded-full hover:bg-[#4F378B] shadow-sm hover:shadow-md transition-all active:scale-[0.97] font-bold text-base flex items-center justify-center gap-3"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk ke Akun'
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-[#E6E0E9]">
          <p className="text-center text-[11px] md:text-xs text-[#49454F] leading-relaxed">
            Belum punya akses? <br className="md:hidden" />
            <span className="font-semibold text-[#6750A4]">
              {' '}
              Hubungi IT Support
            </span>{' '}
            untuk pendaftaran.
          </p>
        </div>
      </div>
    </div>
  );
}
