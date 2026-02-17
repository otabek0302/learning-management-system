'use client';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { LogOut, Settings, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLogoutMutation } from '@/modules/auth/features/api/authApi';
import { cn } from '@/shared/libs/utils';
import { useAuthenticated } from '@/hooks/useAuthenticated';
import { Skeleton } from '../ui/skeleton';

const AuthentedUser = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { isLoading, token, user } = useAuthenticated();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  if (isLoading) {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (!token || !user) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
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
        <Button variant="ghost" size="icon" className={cn('rounded-full', className)} aria-label="User menu">
          <Avatar size="sm" className="h-9 w-9 ring-2 ring-transparent transition-colors hover:ring-primary/30">
            <AvatarImage src={user?.avatar?.secure_url} alt={user?.first_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{user?.first_name?.[0] || user?.last_name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{user?.first_name} {user?.last_name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/settings">
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AuthentedUser };
