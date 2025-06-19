"use client";

import { usePathname } from "next/navigation";

import NavigationList from "@/components/sections/header/navigation-list";
import NavigationIcons from "@/components/sections/header/navigation-icons";
import NavigationLogo from "@/components/sections/header/navigation-logo";
import NavigationMobileMenu from "@/components/sections/header/navigation-mobile-menu";

const Header = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register" || pathname === "/verification") return null;

  return (
    <header className="sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between border-b bg-background py-3">
          {/* Left: Logo */}
          <div className="flex flex-shrink-0 items-center">
            <NavigationLogo />
          </div>

          {/* Center: Navigation List */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <NavigationList />
          </div>

          {/* Right: Icons and Mobile Menu */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <NavigationIcons />
            <NavigationMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
