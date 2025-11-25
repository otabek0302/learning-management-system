"use client";

import CategoryTable from "@/components/sections/admin/categories/category-table";
import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from "@/redux/features/categories/categoryApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

const CategoriesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { data: categoriesData, isLoading, error, refetch } = useGetAllCategoriesQuery({ page: currentPage, limit: rowsPerPage });
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoriesData?.categories || [];
  const pagination = categoriesData?.pagination;

  // Filter categories by search term
  interface Category {
    name: string;
    description?: string;
  }

  const filteredCategories = categories.filter((category: Category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleView = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  };

  const handleEdit = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}/edit-category`);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await deleteCategory(categoryId).unwrap();
        toast.success("Category deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete category");
      }
    }
  };

  const handleCreateCategory = () => {
    router.push("/admin/categories/create-category");
  };

  if (isLoading || isDeleting) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading categories. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pr-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-10 shadow-none focus-visible:ring-1" />
          </div>

          {/* Filter Status */}
          {searchTerm && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredCategories.length} of {categories.length} categories
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateCategory}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:block">Create Category</span>
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-18rem)] flex-col gap-4">
        {/* Categories Table */}
        {filteredCategories.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="text-center">
              <p className="text-muted-foreground">{searchTerm ? `No categories found matching "${searchTerm}".` : "No categories available."}</p>
              {!searchTerm && (
                <Button variant="default" className="mt-4 cursor-pointer rounded-lg" onClick={handleCreateCategory}>
                  <Folder className="mr-2 h-4 w-4" />
                  Create your first category
                </Button>
              )}
            </div>
          </div>
        ) : (
          <CategoryTable categories={filteredCategories} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          count={pagination.totalCategories}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={(page: number) => setCurrentPage(page)}
          onRowsPerPageChange={(rows: number) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          rowsPerPageOptions={[5, 10, 12, 25, 50]}
          selectedCount={0}
        />
      )}
    </div>
  );
};

export default CategoriesPage;

