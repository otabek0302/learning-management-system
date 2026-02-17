'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useResetPasswordMutation } from '@/modules/auth/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset link. Please request a new one.');
      return;
    }
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Password reset successfully');
      router.push('/sign-in');
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? (err as Error)?.message ?? 'Failed to reset password';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {token ? 'Enter your new password below' : 'Invalid or expired link. Please request a new password reset.'}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput id="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} required autoComplete="new-password" placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput id="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} required autoComplete="new-password" placeholder="••••••••" aria-invalid={!!error} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={!token || isLoading}>
        {isLoading ? 'Resetting...' : 'Reset password'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
