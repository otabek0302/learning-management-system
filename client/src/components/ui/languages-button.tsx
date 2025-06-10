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
        <Button variant="outline" size="icon" className="group h-7 w-7 cursor-pointer rounded-lg border-primary shadow-none hover:bg-primary lg:h-8 lg:w-8">
          <Globe className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" align="center" className="mr-1 flex w-fit gap-2 border-none p-0 shadow-none">
        <Button variant="outline" size="icon" className="group h-8 w-8 cursor-pointer rounded-lg border-primary shadow-none hover:bg-primary lg:h-8 lg:w-8" onClick={() => handleLanguageChange("en")}>
          <US className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
        </Button>
        <Button variant="outline" size="icon" className="group h-8 w-8 cursor-pointer rounded-lg border-primary shadow-none hover:bg-primary lg:h-8 lg:w-8" onClick={() => handleLanguageChange("uz")}>
          <UZ className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
        </Button>
        <Button variant="outline" size="icon" className="group h-8 w-8 cursor-pointer rounded-lg border-primary shadow-none hover:bg-primary lg:h-8 lg:w-8" onClick={() => handleLanguageChange("ru")}>
          <RU className="h-4 w-4 text-primary group-hover:text-white lg:h-5 lg:w-5" />
        </Button>
      </PopoverContent>
    </Popover>
  );
};
