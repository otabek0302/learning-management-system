"use client";

import { redirect } from "next/navigation";
import { userAuth } from "./userAuth";

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = userAuth();

  // If we're still loading the session, return null
  if (isAuthenticated === null) return null;

  // If we're not authenticated, redirect to the login page
  if (!isAuthenticated) redirect("/login");

  return <>{children}</>;
};
