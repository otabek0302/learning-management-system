"use client";

import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

import Loading from "@/app/loading";

const Home = () => {
  const { t } = useTranslation();
  const { status } = useSession();

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
