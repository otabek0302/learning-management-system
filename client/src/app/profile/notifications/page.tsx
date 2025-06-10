"use client";

import { Protected } from "@/hooks/useProtected";

import NotificationContent from "@/components/client-ui/profile/notification/notification-list";
import NotificationToolbar from "@/components/client-ui/profile/notification/notification-toolbar";

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
