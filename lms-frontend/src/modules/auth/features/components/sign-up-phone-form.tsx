'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useRegisterByPhoneMutation } from '@/modules/auth/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

export function SignUpPhoneForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterByPhoneMutation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({ first_name: firstName, last_name: lastName, phone, password }).unwrap();
      const msg = data && typeof data === 'object' && 'requiresVerification' in data ? (data as { message?: string }).message : 'Account created. Check your phone for verification code.';
      toast.success(msg ?? 'Verification code sent to your phone.');
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? (err as Error)?.message ?? 'Sign up failed';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" placeholder="+998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}
