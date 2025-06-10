"use client";

import { Protected } from "@/hooks/useProtected";
import { useState } from "react";

import ProfileDialog from "@/components/client-ui/profile/profile-dialog";
import ProfileInformation from "@/components/client-ui/profile/profile-information";
import ProfileToolbar from "@/components/client-ui/profile/profile-toolbar";
import UpdatedPassword from "@/components/client-ui/profile/updated-password";

const ProfilePage = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <Protected>
      <div className="h-full overflow-y-auto p-4">
        <ProfileToolbar openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} />
        <ProfileInformation />
        <UpdatedPassword />
        <ProfileDialog openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} />
      </div>
    </Protected>
  );
};

export default ProfilePage;
