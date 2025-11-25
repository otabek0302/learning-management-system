"use client";

import React, { useState } from "react";
import { useCreateCategoryMutation } from "@/redux/features/categories/categoryApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

const CreateCategoryPage = () => {
  const router = useRouter();
  const [createCategory, { isLoading, isSuccess }] = useCreateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Category created successfully!");
      router.push("/admin/categories");
    }
  }, [isSuccess, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters long";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Category name must not exceed 50 characters";
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
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
      await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Category</h1>
            <p className="mt-1 text-sm text-muted-foreground">Add a new category to organize your courses</p>
          </div>
          <Link href="/admin/categories">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              <p className="text-xs text-muted-foreground">Category name must be between 2 and 50 characters</p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              <p className="text-xs text-muted-foreground">Description must not exceed 500 characters</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 border-t pt-4">
            <Link href="/admin/categories">
              <Button type="button" variant="outline" disabled={isLoading} className="cursor-pointer rounded-lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="cursor-pointer rounded-lg">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryPage;

