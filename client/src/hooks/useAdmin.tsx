"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { userAuth } from "./userAuth";
import { redirect } from "next/navigation";

export const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = userAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  // Wait for auth to load
  if (isAuthenticated === null || user === undefined) return null;

  // Not logged in
  if (!isAuthenticated) redirect("/login");

  // Not an admin - middleware should have already handled this, but as a fallback
  if (user && user.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
};