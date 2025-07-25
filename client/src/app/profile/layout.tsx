import React from "react";
import ProfileSidebar from "@/components/sections/profile/profile-sidebar";

import { Protected } from "@/hooks/useProtected";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <section>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-full md:min-h-[calc(100vh-130px)]">
            <ProfileSidebar />
            <div className="h-full flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </section>
    </Protected>
  );
}
