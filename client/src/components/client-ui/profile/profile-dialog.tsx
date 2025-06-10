"use client";

import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Mail, Loader2, ImageIcon } from "lucide-react";
import { useFormik } from "formik";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUpdateUserInfoMutation } from "@/redux/features/users/userApi";

import Image from "next/image";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toBase64 } from "@/lib/helper";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ProfileDialog = ({ openEditDialog, setOpenEditDialog }: { openEditDialog: boolean; setOpenEditDialog: (open: boolean) => void }) => {
  const { t } = useTranslation();
  const [loadUser, setLoadUser] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { refetch } = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [updateUserInfo, { error, data, status, isLoading, isError, isSuccess }] = useUpdateUserInfoMutation();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!user) {
        toast.error(t("messages.errors.user-not-found"));
        return;
      }
      const base64 = avatarFile ? await toBase64(avatarFile) : null;
      const data = { name: values.name, email: values.email, avatar: base64 };
      await updateUserInfo(data).unwrap();
    },
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(data?.message);
      toast.success(t("messages.success.update-profile-success"));
      setLoadUser(true);
      refetch();
      setOpenEditDialog(false);
    }

    if (isError) {
      console.log(error);
      toast.error(t("messages.errors.update-profile-error"));
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
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setAvatarPreview(fileReader.result as string);
          setAvatarFile(file);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setAvatarFile(null);
    setAvatarPreview("");
    setOpenEditDialog(false);
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, touched, dirty } = formik;

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl">{t("pages.profile.profile-dialog.title")}</DialogTitle>
        <DialogDescription>{t("pages.profile.profile-dialog.description")}</DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar">{t("pages.profile.profile-dialog.avatar")}</Label>
            <div className="relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-xl border p-2" onClick={() => document.getElementById("avatar")?.click()}>
              {avatarPreview ? <Image src={avatarPreview} alt="Avatar" className="h-full w-full rounded-lg object-cover" width={80} height={80} onError={() => setAvatarPreview("")} /> : <ImageIcon className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-primary" />}
              <Input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isLoading} />
            </div>
            <p className="text-xs text-gray-500">{t("pages.profile.profile-dialog.avatar-hint")}</p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("pages.profile.profile-dialog.full-name")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder={t("pages.profile.profile-dialog.full-name-placeholder")} required disabled={isLoading} className={`w-full pl-9 shadow-none focus-visible:ring-1 ${errors.name && touched.name ? "border-red-500" : ""}`} autoComplete="off" />
            </div>
            {errors.name && touched.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("pages.profile.profile-dialog.email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder={t("pages.profile.profile-dialog.email-placeholder")} required disabled={isLoading} className={`w-full pl-9 shadow-none focus-visible:ring-1 ${errors.email && touched.email ? "border-red-500" : ""}`} autoComplete="off" />
            </div>
            {errors.email && touched.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit" variant="outline" className="bg-primary text-white hover:bg-primary/90 dark:bg-gray-800" disabled={isLoading || (!dirty && !avatarFile)}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("pages.profile.profile-dialog.updating")}
                </>
              ) : (
                t("pages.profile.profile-dialog.update")
              )}
            </Button>
            <Button type="button" variant="outline" className="bg-gray-200 hover:bg-gray-100" onClick={handleCancel} disabled={isLoading}>
              {t("pages.profile.profile-dialog.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
