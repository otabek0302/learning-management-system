import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useTranslation } from "react-i18next";

import NextLink from "next/link";

const NavigationList = () => {
  const { t } = useTranslation();

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-2 lg:space-x-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-xs font-semibold transition-colors hover:text-primary lg:text-sm">
            <NextLink href="/" className="px-2 py-1 text-inherit transition-colors duration-300">
              {t("routes.home")}
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-xs font-semibold transition-colors hover:text-primary lg:text-sm">
            <NextLink href="/about" className="px-2 py-1 text-inherit transition-colors duration-300">
              {t("routes.about")}
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-xs font-semibold transition-colors hover:text-primary lg:text-sm">
            <NextLink href="/contact" className="px-2 py-1 text-inherit transition-colors duration-300">
              {t("routes.contact")}
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-xs font-semibold transition-colors hover:text-primary lg:text-sm">
            <NextLink href="/courses" className="px-2 py-1 text-inherit transition-colors duration-300">
              {t("routes.courses")}
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-xs font-semibold transition-colors hover:text-primary lg:text-sm">
            <NextLink href="/policy" className="px-2 py-1 text-inherit transition-colors duration-300">
              {t("routes.policy")}
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="text-xs font-semibold transition-colors hover:text-primary lg:text-sm">
            <NextLink href="/faq" className="px-2 py-1 text-inherit transition-colors duration-300">
              {t("routes.faq")}
            </NextLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationList;
