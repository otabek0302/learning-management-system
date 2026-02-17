'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Github, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation('footer');
  return (
    <footer>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-14 w-full flex-col items-center justify-between gap-4 border-t border-border py-3 md:h-auto md:flex-row md:gap-6">
          <div className="flex flex-col items-center justify-start gap-3 md:flex-row md:justify-center md:gap-4">
            <Link href="/terms-and-condition" className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('termsAndCondition')}
            </Link>
            <Link href="/privacy-policy" className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('privacyPolicy')}
            </Link>
            <Link href="/cookies" className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('cookies')}
            </Link>
          </div>

          <div className="flex justify-center gap-2">
            <Link href="mailto:otabekjon0302@gmail.com" rel="noreferrer" target="_blank" className="group flex h-9 w-9 items-center justify-center rounded-lg border border-primary hover:bg-primary [&_svg]:size-4">
              <span className="sr-only">Mail</span>
              <Mail className="size-4 text-primary group-hover:text-primary-foreground" />
            </Link>

            <Link href="https://www.instagram.com/otabek_03.02" rel="noreferrer" target="_blank" className="group flex h-9 w-9 items-center justify-center rounded-lg border border-primary hover:bg-primary [&_svg]:size-4">
              <span className="sr-only">Instagram</span>
              <Instagram className="size-4 text-primary group-hover:text-primary-foreground" />
            </Link>

            <Link href="https://github.com/otabek0302" rel="noreferrer" target="_blank" className="group flex h-9 w-9 items-center justify-center rounded-lg border border-primary hover:bg-primary [&_svg]:size-4">
              <span className="sr-only">GitHub</span>
              <Github className="size-4 text-primary group-hover:text-primary-foreground" />
            </Link>
          </div>
        </div>
        <div className="flex h-14 items-center justify-between gap-2 border-t border-border">
          <p className="text-center text-sm font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('allRightsReserved')}
          </p>
          <p className="text-center text-sm font-medium text-muted-foreground">
            <span>{t('developedBy')} </span>
            <Link href="https://github.com/otabek0302" rel="noreferrer" target="_blank" className="text-primary transition-colors hover:underline">
              {t('developerName')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
