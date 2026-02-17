import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { VerifyOtpForm } from '@/modules/auth/features/components/verify-otp-form';

export const metadata: Metadata = {
  title: 'Verify OTP',
};

export default function VerifyOtpPage() {
  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid min-h-screen lg:grid-cols-2 py-4">
          <div className="relative hidden lg:block bg-primary-lighter">
            <Image src="/logo.png" alt="LMS" fill className="object-contain p-12 opacity-90" priority />
          </div>
          <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
              <VerifyOtpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
