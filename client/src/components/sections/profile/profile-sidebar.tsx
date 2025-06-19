"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/redux/hooks";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { User, Settings, BookOpen, Bell, LogOut } from "lucide-react";

import Link from "next/link";

const ProfileSidebar = () => {
  const [active, setActive] = useState<string>("profile");
  const dispatch = useAppDispatch();

  const handleActive = (path: string) => {
    setActive(path);
  };

  const logout = () => {
    signOut();
    dispatch(userLoggedOut());
  };

  return (
    <aside className="w-[240px] max-w-[260px] border-r py-4 pr-4">
      <div className="flex h-full flex-col justify-between gap-6">
        <nav className="space-y-1">
          <Link href={"/profile"} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 ${active === "profile" ? "bg-gray-100" : ""}`} onClick={() => handleActive("profile")}>
            <User className="h-5 w-5 text-primary" />
            <span>Profile</span>
          </Link>
          <Link href={"/profile/courses"} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 ${active === "courses" ? "bg-gray-100" : ""}`} onClick={() => handleActive("courses")}>
            <BookOpen className="h-5 w-5 text-primary" />
            <span>My Courses</span>
          </Link>
          <Link href={"/profile/settings"} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 ${active === "settings" ? "bg-gray-100" : ""}`} onClick={() => handleActive("settings")}>
            <Settings className="h-5 w-5 text-primary" />
            <span>Settings</span>
          </Link>
          <Link href={"/profile/notifications"} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 ${active === "notifications" ? "bg-gray-100" : ""}`} onClick={() => handleActive("notifications")}>
            <Bell className="h-5 w-5 text-primary" />
            <span>Notifications</span>
          </Link>
        </nav>

        <Button variant="outline" size="lg" className="mt-auto flex items-center gap-3 rounded-lg px-3 py-3 text-red-600 transition-colors hover:bg-red-50 hover:text-red-600" onClick={logout}>
          <LogOut className="h-5 w-5 text-red-600" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
