'use client';

import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignUpEmailForm } from './sign-up-email-form';
import { SignUpPhoneForm } from './sign-up-phone-form';

export function SignUpForm() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose how you want to register</p>
      </div>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="mt-4">
          <SignUpEmailForm />
        </TabsContent>
        <TabsContent value="phone" className="mt-4">
          <SignUpPhoneForm />
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
