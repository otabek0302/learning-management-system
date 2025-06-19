"use client";

import { useTranslation } from "react-i18next";

const NotificationToolbar = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="ml-1 text-xl font-bold tracking-tight">{t("pages.profile.notifications.title")}</h3>
    </div>
  );
};

export default NotificationToolbar;
