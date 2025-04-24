"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./button";
import { Globe } from "lucide-react";
import { US, UZ, RU } from "country-flag-icons/react/3x2";

export const LanguagesDropdown = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" iconSize="md" className="h-8 w-8 md:w-9 md:h-9 cursor-pointer shadow-none">
          <Globe className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mt-1 flex w-fit flex-col gap-2 border-none p-0 shadow-none">
        <Button variant="outline" size="icon" iconSize="md">
          <US />
        </Button>
        <Button variant="outline" size="icon" iconSize="md">
          <UZ />
        </Button>
        <Button variant="outline" size="icon" iconSize="md">
          <RU />
        </Button>
      </PopoverContent>
    </Popover>
  );
};
