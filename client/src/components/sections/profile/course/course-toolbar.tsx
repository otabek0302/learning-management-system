"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const CourseToolbar = () => {
  const { t } = useTranslation();
  return (
      <div className="flex items-center justify-between gap-4">
        <h3 className="ml-1 text-xl font-bold tracking-tight">{t("pages.profile.courses.title")}</h3>
        <Button variant="outline" className="cursor-pointer rounded-lg border-none bg-primary text-white hover:bg-primary/90 hover:text-white">
          {t("pages.profile.courses.add-course")}
        </Button>
      </div>
  );
};

export default CourseToolbar;
