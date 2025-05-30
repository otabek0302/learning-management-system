"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setTranslation } from "@/lib/i18n";
import { US, UZ, RU } from "country-flag-icons/react/3x2";
import { Button } from "./button";
import { Globe } from "lucide-react";

export const LanguagesButton = () => {
  const handleLanguageChange = (language: string) => {
    setTranslation(language);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer shadow-none lg:h-9 lg:w-9">
          <Globe className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" align="center" className="mr-1 flex w-fit gap-2 border-none p-0 shadow-none">
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer shadow-none lg:h-9 lg:w-9" onClick={() => handleLanguageChange("en")}>
          <US />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer shadow-none lg:h-9 lg:w-9" onClick={() => handleLanguageChange("uz")}>
          <UZ />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer shadow-none lg:h-9 lg:w-9" onClick={() => handleLanguageChange("ru")}>
          <RU />
        </Button>
      </PopoverContent>
    </Popover>
  );
};
