"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUserAuth } from "./userAuth";
import { redirect } from "next/navigation";

export const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useUserAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  // Wait until data are loaded
  const isLoading = isAuthenticated === null || user === undefined;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (user?.role !== "admin") {
    console.warn("Non-admin user attempted to access admin area:", user);
    redirect("/");
  }

  return <>{children}</>;
};