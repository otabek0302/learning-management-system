"use client";

import { useState } from "react";

import ProfileDialog from "@/components/sections/profile/profile-dialog";
import ProfileInformation from "@/components/sections/profile/profile-information";
import ProfileToolbar from "@/components/sections/profile/profile-toolbar";
import UpdatedPassword from "@/components/sections/profile/updated-password";

const ProfilePage = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-4 pr-0">
      <ProfileToolbar openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} />
      <ProfileInformation />
      <UpdatedPassword />
      <ProfileDialog openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} />
    </div>
  );
};

export default ProfilePage;
