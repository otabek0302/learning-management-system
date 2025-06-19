"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const ProfileToolbar = ({ openEditDialog, setOpenEditDialog }: { openEditDialog: boolean; setOpenEditDialog: (open: boolean) => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="ml-1 text-xl font-bold tracking-tight">{t("pages.profile.profile-toolbar.title")}</h3>
      <Button variant="outline" className="cursor-pointer bg-primary text-white rounded-lg border-none hover:bg-primary/90 hover:text-white" onClick={() => setOpenEditDialog(!openEditDialog)}>
        {t("pages.profile.profile-toolbar.edit-profile")}
      </Button>
    </div>
  );
};

export default ProfileToolbar;
