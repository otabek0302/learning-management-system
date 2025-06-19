"use client";
import NextLink from "next/link";

import { ThemeButton, LanguagesButton, NavUser } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const NavigationIcons = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex items-center gap-2">
      <div className="block">
        <LanguagesButton />
      </div>
      <div className="block">
        <ThemeButton />
      </div>
      <div className="hidden md:block">
        {user ? (
          <NavUser />
        ) : (
          <NextLink href="/login" className="cursor-pointer">
            <Button variant="outline" size="default" className="group h-8 cursor-pointer border-primary bg-primary px-6 shadow-none hover:bg-transparent lg:h-9 lg:px-8">
              <span className="text-xs font-semibold text-primary-foreground group-hover:text-primary lg:text-sm">{t("routes.login")}</span>
            </Button>
          </NextLink>
        )}
      </div>
    </div>
  );
};

export default NavigationIcons;
