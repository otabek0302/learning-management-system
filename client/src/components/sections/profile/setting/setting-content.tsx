"use client";

import { Button } from "@/components/ui/button";
import { setTranslation } from "@/lib/i18n";
import { RU, UZ, US } from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Computer } from "lucide-react";

const SettingContent = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, []);

  const handleLanguageChange = (language: string) => {
    setTranslation(language);
    setSelectedLanguage(language);
  };
  return (
    <div className="mt-4">
      <div className="ml-1 flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="space-y-1 sm:w-[200px]">
          <h4 className="text-text-primary text-sm font-medium">{t("pages.profile.settings.language")}</h4>
          <p className="text-text-muted text-sm">{t("pages.profile.settings.language-description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className={`group h-8 w-8 cursor-pointer rounded-lg border shadow-none hover:bg-primary lg:h-8 lg:w-8 ${selectedLanguage === "en" ? "border-primary bg-primary text-white" : ""}`} onClick={() => handleLanguageChange("en")}>
            <US className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
          </Button>
          <Button variant="outline" size="icon" className={`group h-8 w-8 cursor-pointer rounded-lg border shadow-none hover:bg-primary lg:h-8 lg:w-8 ${selectedLanguage === "uz" ? "border-primary bg-primary text-white" : ""}`} onClick={() => handleLanguageChange("uz")}>
            <UZ className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
          </Button>
          <Button variant="outline" size="icon" className={`group h-8 w-8 cursor-pointer rounded-lg border shadow-none hover:bg-primary lg:h-8 lg:w-8 ${selectedLanguage === "ru" ? "border-primary bg-primary text-white" : ""}`} onClick={() => handleLanguageChange("ru")}>
            <RU className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
          </Button>
        </div>
      </div>
      <div className="ml-1 flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="space-y-1 sm:w-[200px]">
          <h4 className="text-text-primary text-sm font-medium">{t("pages.profile.settings.theme")}</h4>
          <p className="text-text-muted text-sm">{t("pages.profile.settings.theme-description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className={`group h-7 w-7 cursor-pointer rounded-lg border shadow-none hover:bg-primary lg:h-8 lg:w-8 ${theme === "light" ? "border-primary bg-primary text-white" : ""}`} onClick={() => setTheme("light")}>
            <Sun className={`h-4 w-4 ${theme === "light" ? "text-white" : "text-primary"} group-hover:text-white lg:h-5 lg:w-5`} />
          </Button>
          <Button variant="outline" size="icon" className={`group h-7 w-7 cursor-pointer rounded-lg border shadow-none hover:bg-primary lg:h-8 lg:w-8 ${theme === "dark" ? "border-primary bg-primary text-white" : ""}`} onClick={() => setTheme("dark")}>
            <Moon className={`h-4 w-4 ${theme === "dark" ? "text-white" : "text-primary"} group-hover:text-white lg:h-5 lg:w-5`} />
          </Button>
          <Button variant="outline" size="icon" className={`group h-7 w-7 cursor-pointer rounded-lg border shadow-none hover:bg-primary lg:h-8 lg:w-8 ${theme === "system" ? "border-primary bg-primary text-white" : ""}`} onClick={() => setTheme("system")}>
            <Computer className={`h-4 w-4 ${theme === "system" ? "text-white" : "text-primary"} group-hover:text-white lg:h-5 lg:w-5`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingContent;
