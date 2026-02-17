'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Settings, User } from 'lucide-react';

import { cn } from '@/shared/libs/utils';

const profileNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/profile/settings', label: 'Settings', icon: Settings },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <nav className="flex flex-row gap-2 overflow-x-auto rounded-lg border border-border bg-card p-1 lg:flex-col lg:overflow-visible">
            {profileNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/profile' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 rounded-lg border border-border bg-card p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}
