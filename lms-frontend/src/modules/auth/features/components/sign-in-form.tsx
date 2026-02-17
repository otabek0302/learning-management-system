'use client';

import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInEmailForm } from './sign-in-email-form';
import { SignInPhoneForm } from './sign-in-phone-form';

export function SignInForm() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose how you want to sign in to your account</p>
      </div>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="mt-4">
          <SignInEmailForm />
        </TabsContent>
        <TabsContent value="phone" className="mt-4">
          <SignInPhoneForm />
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm text-muted-foreground space-x-1">
        <span>Don&apos;t have an account? </span>
        <Link href="/sign-up" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
