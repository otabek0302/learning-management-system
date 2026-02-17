'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/shared/libs/utils';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button variant="primary-outline" size="icon" className={cn('h-9 w-9 rounded-lg shadow-none [&_svg]:size-4 cursor-pointer', className)} aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
};

export { ThemeSwitcher };
