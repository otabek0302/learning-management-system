"use client";

import { Bell, BookOpen, LogOut, Settings, User } from "lucide-react";

import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "@/assets";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User as UserType } from "@/types/user";
import { signOut } from "next-auth/react";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

import Link from "next/link";

export function NavUser() {
  const { user } = useSelector((state: RootState) => state.auth) as { user: UserType | null };
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut();
    dispatch(userLoggedOut());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="group h-7 w-7 cursor-pointer rounded-lg border-primary shadow-none hover:bg-primary lg:h-8 lg:w-8">
          <User className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-none" side="bottom" align="start" sideOffset={16}>
        <DropdownMenuLabel className="p-0 font-normal">
          <Link href="/profile" className="block">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={Logo.src} alt="User" />
                <AvatarFallback className="rounded-lg">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/profile/courses" className="flex items-center gap-2">
              <BookOpen />
              My Courses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/profile/settings" className="flex items-center gap-2">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/profile/notifications" className="flex items-center gap-2">
              <Bell />
              Notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
