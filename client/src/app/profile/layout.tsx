import React from "react";
import ProfileSidebar from "@/components/client-ui/profile/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-full md:min-h-[calc(100vh-130px)]">
          <ProfileSidebar />
          <div className="flex-1 h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </section>
  );
}
