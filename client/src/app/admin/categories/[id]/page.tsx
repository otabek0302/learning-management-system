"use client";

import React from "react";
import { useGetCategoryByIdQuery } from "@/redux/features/categories/categoryApi";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Folder, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const CategoryDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const { data: categoryData, isLoading, error, refetch } = useGetCategoryByIdQuery(categoryId, {
    refetchOnMountOrArgChange: true,
  });
  const category = categoryData?.category;

  const handleBack = () => {
    router.push("/admin/categories");
  };

  const handleEdit = () => {
    router.push(`/admin/categories/${categoryId}/edit-category`);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading category details. Please try again.</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pr-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} className="cursor-pointer rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:block">Back to Categories</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" onClick={handleEdit} className="cursor-pointer rounded-lg">
            <Edit className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">Edit Category</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Information Card */}
        <Card className="lg:col-span-1 shadow-none">
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Icon and Name */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10">
                <Folder className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
            </div>

            {/* Category Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category ID</span>
                <span className="font-mono text-sm">{category._id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {category.createdAt ? format(new Date(category.createdAt), "MMM dd, yyyy") : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">
                  {category.updatedAt ? format(new Date(category.updatedAt), "MMM dd, yyyy") : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Description and Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Description
              </CardTitle>
              <CardDescription>Category description and details</CardDescription>
            </CardHeader>
            <CardContent>
              {category.description ? (
                <p className="text-muted-foreground whitespace-pre-wrap">{category.description}</p>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No description provided</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Category metadata and timestamps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </div>
                  <p className="text-sm font-medium">
                    {category.createdAt ? format(new Date(category.createdAt), "MMMM dd, yyyy 'at' hh:mm a") : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Updated At
                  </div>
                  <p className="text-sm font-medium">
                    {category.updatedAt ? format(new Date(category.updatedAt), "MMMM dd, yyyy 'at' hh:mm a") : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;

