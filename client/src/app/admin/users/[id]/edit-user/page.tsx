"use client";

import React, { useState, useEffect } from "react";
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/features/users/userApi";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: userData, isLoading: isLoadingUser, error, refetch } = useGetSingleUserQuery(userId);
  const [updateUser, { isLoading: isUpdating, isSuccess, isError }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isVerified: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form when user data is loaded
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        isVerified: user.isVerified || false,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("User updated successfully!");
      router.push(`/admin/users/${userId}`);
    }
  }, [isSuccess, router, userId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateUser({ id: userId, data: formData }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBack = () => {
    router.push(`/admin/users/${userId}`);
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error || !userData?.user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading user data. Please try again.</p>
          <Button onClick={() => router.push("/admin/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-4xl flex-col gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="Enter full name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="Enter email address" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Role Field */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Status */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Email Verification</Label>
            <p className="text-sm text-muted-foreground">Mark this user&apos;s email as verified</p>
          </div>
          <Switch checked={formData.isVerified} onCheckedChange={(checked: boolean) => handleInputChange("isVerified", checked)} />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={handleBack} disabled={isUpdating} className="cursor-pointer rounded-lg">
            <span className="hidden sm:block">Cancel</span>
          </Button>
          <Button type="submit" disabled={isUpdating} className="cursor-pointer rounded-lg">
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isUpdating ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
