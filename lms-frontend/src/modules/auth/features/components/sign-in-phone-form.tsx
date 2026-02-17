'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useLoginByPhoneMutation } from '@/modules/auth/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

export function SignInPhoneForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginByPhoneMutation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ phone, password }).unwrap();
      toast.success('Signed in successfully');
      router.push('/');
    } catch (err: unknown) {
      const res = (err as { data?: { message?: string; data?: { requiresVerification?: boolean } } })?.data;
      const msg = res?.message ?? (err as Error)?.message ?? 'Sign in failed';
      if (res?.data?.requiresVerification) {
        toast.success(msg);
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" placeholder="+998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
