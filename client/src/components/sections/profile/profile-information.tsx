"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, ImageIcon, Info, Pencil, Loader2 } from "lucide-react";
import { useUpdateAvatarMutation } from "@/redux/features/users/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import Image from "next/image";

const ProfileInformation = () => {
  const { t } = useTranslation();
  const [loadUser, setLoadUser] = useState(true);

  const { user } = useSelector((state: RootState) => state.auth);
  const { refetch } = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [updateAvatar, { error, data, isLoading, isError, isSuccess }] = useUpdateAvatarMutation();

  useEffect(() => {
    if (isSuccess) {
      console.log(data?.message);
      toast.success(t("messages.success.update-profile-success"));
      setLoadUser(true);
      refetch();
    }

    if (isError) {
      console.log(error);
      toast.error(t("messages.errors.update-profile-error"));
      setLoadUser(false);
    }
  }, [isSuccess, isError]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t("messages.errors.invalid-file-type"));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("messages.errors.file-too-large"));
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        if (fileReader.readyState === 2) {
          try {
            const base64 = fileReader.result as string;
            await updateAvatar({ avatar: base64 }).unwrap();
          } catch (error) {
            console.error("Avatar update failed:", error);
            toast.error(t("messages.errors.update-profile-error"));
          }
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Card className="mt-6 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5 text-primary" />
          {t("pages.profile.profile-information.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user && (
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="group relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border p-2">
              {user.avatar?.url ? <Image src={user.avatar.url} alt="avatar" fill priority className="object-cover object-center" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /> : <ImageIcon className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-primary" />}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">{isLoading ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : <Pencil className="h-8 w-8 text-white" />}</div>
              <label htmlFor="avatar-info" className="absolute inset-0 cursor-pointer" />
              <Input type="file" id="avatar-info" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isLoading} />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  {t("pages.profile.profile-information.full-name")}
                </div>
                <p className="rounded-md border p-2 text-sm">{user.name || ""}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {t("pages.profile.profile-information.email")}
                </div>
                <p className="rounded-md border p-2 text-sm">{user.email || ""}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInformation;
