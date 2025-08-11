"use client";

import React, { useState } from "react";
import { useCreateUserMutation } from "@/redux/features/users/userApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const CreateUserPage = () => {
  const router = useRouter();
  const [createUser, { isLoading, isSuccess, isError }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("User created successfully!");
      router.push("/admin/users");
    }
    if (isError) {
      toast.error("Failed to create user. Please try again.");
    }
  }, [isSuccess, isError, router]);

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

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
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
      const res = await createUser(formData as any);
      console.log(res);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBack = () => {
    router.push("/admin/users");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      {/* Form */}
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

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className={errors.password ? "border-red-500" : ""} />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
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

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading} className="cursor-pointer rounded-lg">
            <span className="hidden sm:block">Cancel</span>
          </Button>
          <Button type="submit" disabled={isLoading} className="cursor-pointer rounded-lg">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPage;
