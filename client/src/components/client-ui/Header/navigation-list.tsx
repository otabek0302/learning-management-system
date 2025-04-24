import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { navigations } from "@/data/data";

import NextLink from "next/link";

const NavigationList = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-4">
        {navigations.map((navigation) => (
          <NavigationMenuItem key={navigation.label}>
            <NavigationMenuLink asChild className="text-sm font-semibold transition-colors hover:text-primary">
              <NextLink href={navigation.href} className="px-2 py-1 text-inherit transition-colors duration-300">
                {navigation.label}
              </NextLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationList;
