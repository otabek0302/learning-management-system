"use client";

import { redirect } from "next/navigation";
import { useUserAuth } from "./userAuth";

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useUserAuth();

  // If we're still loading the session, return null
  if (isAuthenticated === null) return null;

  // If we're not authenticated, redirect to the login page
  if (!isAuthenticated) redirect("/login");

  return <>{children}</>;
};
