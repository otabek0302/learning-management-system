'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { ThemeSwitcher } from '../widgets/theme-switcher';
import { LanguageSwitcher } from '../widgets/language-switcher';
import { AuthentedUser } from '../widgets/authented-user';

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../ui/navigation-menu';

const Header = () => {
  const { t } = useTranslation('navigation');
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center bg-background/95 backdrop-blur transition-[height,width] ease-linear supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 relative flex flex-1 items-center justify-between border-b border-border">
        <div className="flex items-center gap-4 py-2">
          <Link href="/" className="relative h-8 w-8 cursor-pointer md:h-10 md:w-14" aria-label={t('home')}>
            <Image src={'/logo.png'} alt="Logo" fill priority className="object-contain" sizes="(max-width: 768px) 32px, 36px" />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="px-0">
                <NavigationMenuLink href="/" className="hover:bg-transparent hover:text-primary transition-colors text-sm text-muted-foreground">
                  {t('home')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="px-0">
                <NavigationMenuLink href="/about-us" className="hover:bg-transparent hover:text-primary transition-colors text-sm text-muted-foreground">
                  {t('about')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="px-0">
                <NavigationMenuLink href="/courses" className="hover:bg-transparent hover:text-primary transition-colors text-sm text-muted-foreground">
                  {t('courses')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="px-0">
                <NavigationMenuLink href="/contact-us" className="hover:bg-transparent hover:text-primary transition-colors text-sm text-muted-foreground">
                  {t('contactUs')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <AuthentedUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
