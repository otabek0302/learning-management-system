"use client";

import { usePathname } from "next/navigation";

import NavigationList from "@/components/client-ui/header/navigation-list";
import NavigationIcons from "@/components/client-ui/header/navigation-icons";
import NavigationLogo from "@/components/client-ui/header/navigation-logo";
import NavigationMobileMenu from "@/components/client-ui/header/navigation-mobile-menu";

const Header = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register" || pathname === "/verification") return null;

  return (
    <header className="border-b bg-background px-4 py-3">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
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
