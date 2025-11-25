"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, MoreVerticalIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/assets";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User as UserType } from "@/shared/types";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserAuth } from "@/hooks/userAuth";

import NextLink from "next/link";
import Image from "next/image";

const NavigationMobileMenu = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth) as { user: UserType | null };
  const isAuthenticated = useUserAuth();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" iconSize="md" className="h-8 w-8 cursor-pointer shadow-none md:h-9 md:w-9">
            <Menu className="text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-4">
          <SheetHeader className="mb-4 border-b border-border">
            <SheetTitle className="flex items-center justify-center gap-2">
              <div className="relative h-12 w-12">
                <Image src={Logo} alt="Logo" fill className="object-contain" />
              </div>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col items-start gap-4">
            <li className="w-full border-l-[2px] border-primary hover:border-primary/50">
              <NextLink href="/" className="px-2 py-1 text-base font-semibold transition-colors duration-300 hover:text-primary">
                {t("routes.home")}
              </NextLink>
            </li>
            <li className="w-full border-l-[2px] border-primary hover:border-primary/50">
              <NextLink href="/about" className="px-2 py-1 text-base font-semibold transition-colors duration-300 hover:text-primary">
                {t("routes.about")}
              </NextLink>
            </li>
            <li className="w-full border-l-[2px] border-primary hover:border-primary/50">
              <NextLink href="/contact" className="px-2 py-1 text-base font-semibold transition-colors duration-300 hover:text-primary">
                {t("routes.contact")}
              </NextLink>
            </li>
            <li className="w-full border-l-[2px] border-primary hover:border-primary/50">
              <NextLink href="/courses" className="px-2 py-1 text-base font-semibold transition-colors duration-300 hover:text-primary">
                {t("routes.courses")}
              </NextLink>
            </li>
            <li className="w-full border-l-[2px] border-primary hover:border-primary/50">
              <NextLink href="/policy" className="px-2 py-1 text-base font-semibold transition-colors duration-300 hover:text-primary">
                {t("routes.policy")}
              </NextLink>
            </li>
            <li className="w-full border-l-[2px] border-primary hover:border-primary/50">
              <NextLink href="/faq" className="px-2 py-1 text-base font-semibold transition-colors duration-300 hover:text-primary">
                {t("routes.faq")}
              </NextLink>
            </li>
          </ul>
          <SheetFooter className="mt-auto">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex items-center gap-2 cursor-pointer w-full">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar?.url || ""} alt={user.name || "User"} />
                      <AvatarFallback className="rounded-lg">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name || "User"}</span>
                      <span className="truncate text-xs text-muted-foreground">{user.email || ""}</span>
                    </div>
                    <MoreVerticalIcon className="ml-auto size-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mb-2 w-72 max-w-full space-y-1 border-none shadow-none">
                  <DropdownMenuItem asChild className="cursor-pointer border-[0.1px] shadow-none">
                    <NextLink href="/profile">Profile</NextLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer border-[0.1px] shadow-none">
                    <NextLink href="/profile/courses">My Courses</NextLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer border-[0.1px] shadow-none">
                    <NextLink href="/profile/settings">Settings</NextLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer border-[0.1px] shadow-none text-red-600"
                    onClick={async () => {
                      try {
                        await logout().unwrap();
                        await signOut({ redirect: false });
                        router.push("/login");
                        toast.success("Logged out successfully");
                      } catch (error) {
                        await signOut({ redirect: false });
                        router.push("/login");
                      }
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Button asChild className="w-full" variant="default">
                  <NextLink href="/login">Sign In</NextLink>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <NextLink href="/login">Sign Up</NextLink>
                </Button>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavigationMobileMenu;
