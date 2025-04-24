"use client";

import NavigationList from "../client-ui/Header/navigation-list";
import NavigationIcons from "../client-ui/Header/navigation-icons";
import NavigationLogo from "../client-ui/Header/navigation-logo";
import NavigationMobileMenu from "../client-ui/Header/navigation-mobile-menu";
const Header = () => {
  return (
    <header className="border-b bg-background px-4 py-3">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <NavigationLogo />
          </div>
          <div className="hidden md:flex items-center justify-center gap-2">
            <NavigationList />
          </div>
          <div className="flex items-center justify-end gap-2">
            <NavigationIcons />
            <NavigationMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
