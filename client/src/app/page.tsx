"use client";

import { NextSeo } from "next-seo";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo title={t("pages.home.meta.title")} description={t("pages.home.meta.description")} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
        <h1>{t("pages.home.meta.title")}</h1>
      </main>
    </>
  );
};

export default Home;
