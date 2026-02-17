import type { Metadata } from 'next';
import Image from 'next/image';
import { SignInForm } from '@/modules/auth/features/components/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid min-h-screen lg:grid-cols-2 py-4">
          <div className="relative hidden lg:block bg-primary-lighter">
            <Image src="/logo.png" alt="LMS" fill className="object-contain p-12 opacity-90" priority />
          </div>
          <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
            <SignInForm />
          </div>
        </div>
      </div>
    </section>
  );
}
