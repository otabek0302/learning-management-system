"use client";

import React from "react";
import LayoutPagePreview from "@/components/sections/admin/layout-page/layout-page-preview";

import { Layout } from "@/interfaces/layout.interface";
import { useDeleteLayoutMutation, useGetAllLayoutsQuery } from "@/redux/features/layout-page/layoutApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutPagePreviewProps {
  layouts?: Layout[];
  isLoading?: boolean;
}

const LayoutPageClient: React.FC<LayoutPagePreviewProps> = () => {
  const router = useRouter();
  const { data: layoutsResponse, isLoading, error, refetch } = useGetAllLayoutsQuery({});
  const [deleteLayout, { isLoading: isDeleting }] = useDeleteLayoutMutation();

  const layouts = layoutsResponse?.layouts || [];

  const handleView = (layoutType: string) => {
    router.push(`/admin/layout-page/${layoutType}`);
  };

  const handleEdit = (layoutId: string) => {
    router.push(`/admin/layout-page/${layoutId}/edit-layout-page`);
  };

  const handleDelete = async (layoutId: string) => {
    if (window.confirm("Are you sure you want to delete this layout? This action cannot be undone.")) {
      try {
        await deleteLayout(layoutId);
        toast.success("Layout deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete layout");
      }
    }
  };

  const handleCreateLayout = () => {
    router.push("/admin/layout-page/create-layout-page");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading layouts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading layouts. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pr-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <h3 className="text-2xl font-bold">Layout Pages</h3>
        </div>

        <div className="flex items-center gap-2">
          {layouts.length < 3 && (
            <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateLayout}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:block">Create Layout</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-18rem)] flex-col gap-4">
        {/* Courses Grid/List */}
        {layouts.length == 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="text-center">
              <p className="text-muted-foreground">No layouts available.</p>
              <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateLayout}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:block">Create Layout</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {layouts.map((layout: any) => (
              <LayoutPagePreview key={layout._id} layout={layout} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutPageClient;
