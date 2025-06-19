"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUpdatePasswordMutation } from "@/redux/features/users/userApi" 

const UpdatedPassword = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [updatePassword, { error, data, isLoading, isError, isSuccess }] = useUpdatePasswordMutation();

  const [passwordData, setPasswordData] = useState<{ currentPassword: string; newPassword: string; confirmPassword: string }>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("messages.success.update-password-success"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

    if (isError) {
      toast.error(t("messages.errors.update-password-error"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isSuccess, isError, isLoading, error]);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("messages.errors.passwords-not-match"));
      return;
    }

    if (!user) {
      toast.error(t("messages.errors.user-not-found"));
      return;
    }
    
    await updatePassword({
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
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
              <Input 
                id="currentPassword" 
                type={showCurrentPassword ? "text" : "password"} 
                value={passwordData.currentPassword} 
                name="currentPassword"
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                placeholder={t("pages.profile.updated-password.current-password-placeholder")} 
                required 
                className="w-full pl-9 pr-10 shadow-none focus-visible:ring-1" 
                disabled={isLoading} 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("pages.profile.updated-password.new-password")}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="newPassword" 
                type={showNewPassword ? "text" : "password"} 
                value={passwordData.newPassword} 
                name="newPassword"
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                placeholder={t("pages.profile.updated-password.new-password-placeholder")} 
                required 
                className="w-full pl-9 pr-10 shadow-none focus-visible:ring-1" 
                disabled={isLoading} 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("pages.profile.updated-password.confirm-password")}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                value={passwordData.confirmPassword} 
                name="confirmPassword"
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                placeholder={t("pages.profile.updated-password.confirm-password-placeholder")} 
                required 
                className="w-full pl-9 pr-10 shadow-none focus-visible:ring-1" 
                disabled={isLoading} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="cursor-pointer bg-primary text-white hover:bg-primary/90 dark:bg-gray-800 dark:text-white" disabled={isLoading}>
              {isLoading ? t("pages.profile.updated-password.updating") : t("pages.profile.updated-password.update-password")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdatedPassword;
