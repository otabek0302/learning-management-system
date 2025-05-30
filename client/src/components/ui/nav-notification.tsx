"use client";

import { Logo } from "@/assets";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

export const NavNotification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer shadow-none lg:h-9 lg:w-9">
          <Bell className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-none" side="bottom" align="start" sideOffset={16}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={Logo.src} alt="User" />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">John Doe</span>
              <span className="truncate text-xs">john.doe@example.com</span>
            </div>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
