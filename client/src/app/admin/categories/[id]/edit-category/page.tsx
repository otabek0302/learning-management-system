"use client";

import React, { useState, useEffect } from "react";
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/redux/features/categories/categoryApi";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

const EditCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const { data: categoryData, isLoading: isLoadingCategory, error, refetch } = useGetCategoryByIdQuery(categoryId);
  const [updateCategory, { isLoading: isUpdating, isSuccess }] = useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form when category data is loaded
  useEffect(() => {
    if (categoryData?.category) {
      const category = categoryData.category;
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [categoryData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Category updated successfully!");
      router.push(`/admin/categories/${categoryId}`);
    }
  }, [isSuccess, router, categoryId]);

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
      await updateCategory({
        id: categoryId,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        },
      }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoadingCategory) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading category data...</p>
        </div>
      </div>
    );
  }

  if (error || !categoryData?.category) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading category data. Please try again.</p>
          <Button onClick={() => router.push("/admin/categories")} className="mt-4">
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Category</h1>
            <p className="mt-1 text-sm text-muted-foreground">Update category information</p>
          </div>
          <Link href={`/admin/categories/${categoryId}`}>
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
            <Link href={`/admin/categories/${categoryId}`}>
              <Button type="button" variant="outline" disabled={isUpdating} className="cursor-pointer rounded-lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating} className="cursor-pointer rounded-lg">
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isUpdating ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;

