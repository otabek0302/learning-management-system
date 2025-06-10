"use client";

import { Protected } from "@/hooks/useProtected";

import SettingContent from "@/components/client-ui/profile/setting/setting-content";
import SettingToolbar from "@/components/client-ui/profile/setting/setting-toolbar";

const SettingsPage = () => {
  return (
    <Protected>
      <div className="h-full overflow-y-auto p-4">
        <SettingToolbar />
        <SettingContent />
      </div>
    </Protected>
  );
};

export default SettingsPage;