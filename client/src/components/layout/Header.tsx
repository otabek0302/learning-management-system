"use client";

import { Button } from "@/components/ui/button";
import { Bell, Maximize, Minimize, Moon, Sun } from "lucide-react";
import { LanguagesDropdown } from "@/components/ui/languages-dropdown";
import { useTheme } from "next-themes";
import { useState } from "react";
import { NavUser } from "@/components/ui/nav-user";

import Logo from "@/assets/images/logo.png";
import Image from "next/image";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMaximized) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <header className="px-4 py-3 border-b bg-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="relative w-12 h-12">
            <Image src={Logo} alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex-1 flex items-center justify-end gap-2">
            <LanguagesDropdown />
            <Button
              variant="outline"
              size="icon"
              iconSize="md"
              className="shadow-none cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="text-primary" />
              ) : (
                <Moon className="text-primary" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              iconSize="md"
              className="shadow-none cursor-pointer">
              <Bell className="text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              iconSize="md"
              className="shadow-none cursor-pointer"
              onClick={handleMaximize}>
              {isMaximized ? (
                <Minimize className="text-primary" />
              ) : (
                <Maximize className="text-primary" />
              )}
            </Button>
            <NavUser />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
