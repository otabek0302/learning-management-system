'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RootState } from '@/services/redux/store';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const getInitials = () => {
    if (!user) return '?';
    const u = user as { first_name?: string; last_name?: string; name?: string; email?: string };
    if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase();
    if (u.name) return u.name.slice(0, 2).toUpperCase();
    if (u.email) return u.email[0].toUpperCase();
    return 'U';
  };

  const displayName =
    (user as { first_name?: string; last_name?: string })?.first_name
      ? `${(user as { first_name?: string }).first_name} ${((user as { last_name?: string }).last_name || '').trim()}`.trim()
      : (user as { name?: string })?.name || (user as { email?: string })?.email || 'User';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and manage your account information.</p>
      </div>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={(user as { avatar?: string })?.avatar} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-2xl font-medium text-primary">{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{(user as { email?: string })?.email}</p>
          <p className="text-xs text-muted-foreground">{(user as { role?: string })?.role || 'Learner'}</p>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          To update your profile information, go to{' '}
          <Link href="/profile/settings" className="font-medium text-primary hover:underline">
            Settings
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
