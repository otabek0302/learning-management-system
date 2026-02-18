'use client';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { Bell, HelpCircle, LogOut, Settings, Shield, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLogoutMutation } from '@/modules/auth/features/api/authApi';
import { useAuthenticated } from '@/hooks/useAuthenticated';

const AuthenticatedUser = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { token, user } = useAuthenticated();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  if (!token || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="primary-outline" size="sm" className="h-9 rounded-lg text-sm font-medium shadow-none [&_svg]:size-4" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button variant="primary-default" size="sm" className="h-9 rounded-lg text-sm font-medium shadow-none [&_svg]:size-4" asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary-default" size="sm" className="h-9 flex items-center gap-2 rounded-lg px-2" aria-label="User menu">
          <Avatar size="sm" className="h-9 w-9 shrink-0 border ring-2 ring-transparent transition-colors hover:ring-primary/30">
            <AvatarImage src={user?.avatar?.secure_url} alt={user?.first_name + ' ' + user?.last_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{user?.first_name?.[0] || user?.last_name?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <span className="max-w-32 truncate text-sm font-medium text-foreground">{user?.first_name + ' ' + user?.last_name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 space-y-2 shadow-md rounded-xl p-3">
        <DropdownMenuLabel className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="h-12 w-12 shrink-0">
              <AvatarImage src={user?.avatar?.secure_url} alt={user?.first_name + ' ' + user?.last_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{user?.first_name?.[0] || user?.last_name?.[0] || 'AO'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.first_name + ' ' + user?.last_name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || '—'}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex cursor-pointer items-center gap-2">
            <User className="size-4 shrink-0" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/settings" className="flex cursor-pointer items-center gap-2">
            <Settings className="size-4 shrink-0" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="flex cursor-pointer items-center gap-2">
            <Bell className="size-4 shrink-0" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/privacy" className="flex cursor-pointer items-center gap-2">
            <Shield className="size-4 shrink-0" />
            <span>Privacy & Security</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex cursor-pointer items-center gap-2">
            <HelpCircle className="size-4 shrink-0" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="size-4 shrink-0" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AuthenticatedUser };
