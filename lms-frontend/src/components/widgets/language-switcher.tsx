'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { locales } from '@/services/i18n';
import { cn } from '@/shared/libs/utils';

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(locales[0]);

  useEffect(() => {
    setCurrent(locales.find((l) => l.code === i18n.language) ?? locales[0]);
  }, [i18n.language]);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="primary-outline" size="sm" className={cn('h-9 gap-1.5 rounded-lg px-3 text-sm font-medium shadow-none [&_svg]:size-4 cursor-pointer', className)} aria-label="Select language">
          <Globe className="size-4" />
          <span>{current.label}</span>
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-auto min-w-40 p-1">
        <div className="flex flex-col gap-0.5">
          {locales.map((locale) => (
            <Button key={locale.code} variant="ghost" size="sm" className={cn('h-9 justify-start rounded-md', i18n.language === locale.code && 'bg-accent font-medium')} onClick={() => handleSelect(locale.code)}>
              {locale.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { LanguageSwitcher };
