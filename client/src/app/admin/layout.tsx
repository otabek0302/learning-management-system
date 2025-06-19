import React from "react";
import AdminSidebar from "@/components/sections/admin/admin-sidebar";

import { ProtectedAdmin } from "@/hooks/useAdmin";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedAdmin>
      <section>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-full md:min-h-[calc(100vh-130px)]">
            <AdminSidebar />
            <div className="h-full flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </section>
    </ProtectedAdmin>
  );
};

export default AdminLayout;
