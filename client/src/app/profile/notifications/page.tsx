"use client";

import { Protected } from "@/hooks/useProtected";

import NotificationContent from "@/components/sections/profile/notification/notification-list";
import NotificationToolbar from "@/components/sections/profile/notification/notification-toolbar";

const NotificationsPage = () => {
  return (
    <Protected>
      <div className="h-full overflow-y-auto p-4">
        <NotificationToolbar />
        <NotificationContent />
      </div>
    </Protected>
  );
};

export default NotificationsPage;
