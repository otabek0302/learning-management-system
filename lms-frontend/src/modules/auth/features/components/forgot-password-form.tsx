'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useForgotPasswordMutation } from '@/modules/auth/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setSubmitted(true);
      toast.success('If an account exists, we sent a reset link to your email.');
      setTimeout(() => router.push('/sign-in'), 1500);
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? (err as Error)?.message ?? 'Failed to send reset link';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        <p className="text-sm text-muted-foreground mt-1">{submitted ? 'If an account exists, we sent a reset link to your email.' : 'Enter your email and we&apos;ll send you a reset link'}</p>
      </div>
      {!submitted ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send reset link'}
          </Button>
        </>
      ) : null}
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
