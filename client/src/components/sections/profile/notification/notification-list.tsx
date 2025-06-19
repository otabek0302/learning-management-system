import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import NotificationCard from "./notification-card";

const NotificationContent = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications(notifications);
  }, []);

  if (notifications.length === 0) {
    return (
      <div className="mt-4 flex h-72 items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">{t("messages.errors.no-notifications")}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} />
      ))}
    </div>
  );
};

export default NotificationContent;
