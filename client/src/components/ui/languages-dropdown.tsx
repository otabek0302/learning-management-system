"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./button";
import { Globe } from "lucide-react";
import { US, UZ, RU } from "country-flag-icons/react/3x2";

export const LanguagesDropdown = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" iconSize="md">
          <Globe className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 mt-1 flex flex-col gap-2 border-none shadow-none">
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
