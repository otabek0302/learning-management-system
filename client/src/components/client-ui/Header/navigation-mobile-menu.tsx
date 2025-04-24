import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigations, user } from "@/data/data";
import { Menu, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/assets";

import NextLink from "next/link";
import Image from "next/image";

const NavigationMobileMenu = () => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" iconSize="md" className="h-8 w-8 cursor-pointer shadow-none md:h-8 md:h-9 md:w-8 md:w-9">
            <Menu className="text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4 flex flex-col">
          <SheetHeader className="mb-4 border-b border-border">
            <SheetTitle className="flex items-center justify-center gap-2">
              <div className="relative h-12 w-12">
                <Image src={Logo} alt="Logo" fill className="object-contain" />
              </div>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col items-start gap-4">
            {navigations.map((navigation) => (
              <li key={navigation.label} className="w-full border-l-[2px] border-primary hover:border-primary/50">
                <NextLink href={navigation.href} className="px-2 py-1 text-base font-semibold hover:text-primary transition-colors duration-300">
                  {navigation.label}
                </NextLink>
              </li>
            ))}
          </ul>
          <SheetFooter className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={user.avatar.src} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <MoreVerticalIcon className="ml-auto size-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 mb-2 max-w-full space-y-1 shadow-none border-none">
                <DropdownMenuItem asChild className="border-[0.1px] shadow-none cursor-pointer">
                  <NextLink href="/profile">Profile</NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="border-[0.1px] shadow-none cursor-pointer">
                  <NextLink href="/courses">Courses</NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="border-[0.1px] shadow-none cursor-pointer">
                  <NextLink href="/settings">Settings</NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="border-[0.1px] shadow-none cursor-pointer">
                  <NextLink href="/logout">Logout</NextLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavigationMobileMenu;
