"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const UpdatedPassword = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("components.admin-ui.profile.messages.passwords-not-match"));
      return;
    }

    if (!user) {
      toast.error(t("components.admin-ui.profile.messages.user-not-found"));
      return;
    }

    // const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);

    // if (success) {
    // toast.success(t('components.admin-ui.profile.messages.update-password-success'));
    //   setPasswordData({
    //     currentPassword: '',
    //     newPassword: '',
    //     confirmPassword: '',
    //   });
    // } else if (error) {
    //   toast.error(t('components.admin-ui.profile.messages.update-password-error'));
    // }
    setLoading(false);
  };

  return (
    <Card className="mt-6 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lock className="h-5 w-5 text-primary" />
          {t("pages.profile.updated-password.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("pages.profile.updated-password.current-password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder={t("pages.profile.updated-password.current-password-placeholder")} required className="w-full pl-9 shadow-none focus-visible:ring-1" disabled={loading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("pages.profile.updated-password.new-password")}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder={t("pages.profile.updated-password.new-password-placeholder")} required className="w-full pl-9 shadow-none focus-visible:ring-1" disabled={loading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("pages.profile.updated-password.confirm-password")}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder={t("pages.profile.updated-password.confirm-password-placeholder")} required className="w-full pl-9 shadow-none focus-visible:ring-1" disabled={loading} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="cursor-pointer bg-primary text-white hover:bg-primary/90 dark:bg-gray-800 dark:text-white" disabled={loading}>
              {loading ? t("pages.profile.updated-password.updating") : t("pages.profile.updated-password.update-password")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdatedPassword;
