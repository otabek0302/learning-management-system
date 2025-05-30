"use client";

import { useState } from "react";
import { NextSeo } from "next-seo";
import { useTranslation } from "react-i18next";
import { Login, Register, Verified } from "@/assets";

import Image from "next/image";
import SignUpForm from "@/components/client-ui/auth/sign-up-form";
import SignInForm from "@/components/client-ui/auth/sign-in-form";
import Verification from "@/components/client-ui/auth/verification";

const LoginPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState("sign-in");
  
  return (
    <>
      <NextSeo title={t("pages.login.meta.title")} description={t("pages.login.meta.description")} />
      <section className="p-2.5">
        <div className="flex justify-between gap-10">
          <div className="flex max-w-3xl flex-1 items-center justify-center">{page === "sign-in" ? <SignInForm setPage={setPage} /> : page === "sign-up" ? <SignUpForm setPage={setPage} /> : <Verification setPage={setPage} />}</div>
          <div className="min-h-[calc(100vh-20px)] flex-1">
            <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-transparent">
              <Image src={page === "sign-in" ? Login : page === "sign-up" ? Register : Verified} alt="Login" fill priority className="object-cover" sizes="cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
