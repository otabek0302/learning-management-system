"use client";

import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/app/loading";

const Home = () => {
  const { t } = useTranslation();
  const { status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user was redirected due to access denied
    const accessDenied = searchParams.get("access");
    if (accessDenied === "denied") {
      toast.error("Access denied. You don't have permission to access that page.");
    }
  }, [searchParams]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <main className="flex h-full w-full flex-col items-center justify-center p-8">
      <h1>{t("pages.home.meta.title")}</h1>
    </main>
  );
};

export default Home;
