'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useVerifyOtpMutation, useResendOtpMutation } from '@/modules/auth/features/api/authApi';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';

function getAuthPayload(searchParams: URLSearchParams) {
  const email = searchParams.get('email')?.trim() ?? '';
  const phone = searchParams.get('phone')?.trim() ?? '';
  return {
    email: email || undefined,
    phone: phone || undefined,
    hasEmail: !!email,
    hasPhone: !!phone,
    hasIdentifier: !!email || !!phone,
  };
}

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email, phone, hasEmail, hasPhone, hasIdentifier } = getAuthPayload(searchParams);
  const isEmailFlow = hasEmail || !hasPhone;
  const [verify, { isLoading }] = useVerifyOtpMutation();
  const [resend, { isLoading: isResending }] = useResendOtpMutation();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    if (!hasIdentifier) {
      toast.error('Session expired. Please sign up again.');
      router.push('/sign-up');
      return;
    }
    try {
      await verify({ email, phone, code }).unwrap();
      toast.success(isEmailFlow ? 'Email verified successfully' : 'Phone verified successfully');
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? (err as Error)?.message ?? 'Verification failed';
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (!hasIdentifier) {
      toast.error('Session expired. Please sign up again.');
      router.push('/sign-up');
      return;
    }
    try {
      await resend({ email, phone }).unwrap();
      toast.success('Verification code sent');
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? (err as Error)?.message ?? 'Failed to resend code';
      toast.error(msg);
    }
  };

  if (!hasIdentifier) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Session expired</h1>
        <p className="text-sm text-muted-foreground">Please sign up again to receive a verification code.</p>
        <Button asChild className="w-full">
          <Link href="/sign-up">Go to sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{isEmailFlow ? 'Verify your email' : 'Verify your phone'}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEmailFlow ? 'Enter the 6-digit code sent to your email' : 'Enter the 6-digit code sent to your phone'}
        </p>
      </div>
      <div className="space-y-3">
        <OtpInput value={code} onChange={setCode} disabled={isLoading} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
        {isLoading ? 'Verifying...' : 'Verify'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{' '}
        <button type="button" onClick={handleResend} disabled={isResending} className="text-primary font-medium hover:underline">
          {isResending ? 'Sending...' : 'Resend'}
        </button>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
