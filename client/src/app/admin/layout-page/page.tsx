"use client";

import React from "react";
import Image from "next/image";

import { useDeleteLayoutMutation, useGetAllLayoutsQuery } from "@/redux/features/layout-page/layoutApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Edit, ImageIcon, HelpCircle, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Layout } from "@/shared/interfaces";

const LayoutPageClient: React.FC = () => {
  const router = useRouter();
  const { data: layoutsResponse, isLoading, error, refetch } = useGetAllLayoutsQuery({});
  const [deleteLayout] = useDeleteLayoutMutation();

  const layouts = layoutsResponse?.layouts || [];
  const bannerLayout = layouts.find((l: Layout) => l.type === "banner");
  const faqLayout = layouts.find((l: Layout) => l.type === "faq");
  const categoriesLayout = layouts.find((l: Layout) => l.type === "categories");

  const handleDelete = async (layoutId: string, type: string) => {
    if (window.confirm(`Are you sure you want to delete the ${type} section? This action cannot be undone.`)) {
      try {
        await deleteLayout(layoutId).unwrap();
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} section deleted successfully`);
        refetch();
      } catch (error: any) {
        console.error("Failed to delete layout:", error);
        toast.error(error?.data?.message || "Failed to delete section. Please try again.");
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

  const hasAnyLayout = layouts.length > 0;

  return (
    <div className="space-y-6 p-4 pr-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <h3 className="text-2xl font-bold">Layout Configuration</h3>
          <p className="text-sm text-muted-foreground">Manage your landing page sections</p>
        </div>

        <div className="flex items-center gap-2">
          {!hasAnyLayout ? (
            <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateLayout}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:block">Create Layout</span>
            </Button>
          ) : (
            <>
              <Button variant="default" className="cursor-pointer rounded-lg" onClick={() => router.push("/admin/layout-page/edit")}>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:block">Edit Layout</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="destructive" size="sm" className="cursor-pointer rounded-lg">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:block">Delete</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {bannerLayout && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(bannerLayout._id, "banner")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Banner Section
                    </DropdownMenuItem>
                  )}
                  {faqLayout && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(faqLayout._id, "faq")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete FAQ Section
                    </DropdownMenuItem>
                  )}
                  {categoriesLayout && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(categoriesLayout._id, "categories")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Categories Section
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {!hasAnyLayout ? (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">No layout sections created yet.</p>
              <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateLayout}>
                <Plus className="h-4 w-4" />
                <span>Create Layout</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Banner Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Hero/Banner Section</CardTitle>
                  </div>
                  {!bannerLayout && <Badge variant="outline">Not Created</Badge>}
                </div>
                <CardDescription>Hero banner with image, title, and subtitle</CardDescription>
              </CardHeader>
              <CardContent>
                {bannerLayout ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    {bannerLayout.banner?.image?.url ? (
                      <Image
                        src={bannerLayout.banner.image.url}
                        alt={bannerLayout.banner?.title || "Banner"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <ImageIcon className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="text-center text-white">
                        <h3 className="mb-2 text-xl font-bold">{bannerLayout.banner?.title || "Banner Title"}</h3>
                        {bannerLayout.banner?.subTitle && <p className="text-sm">{bannerLayout.banner.subTitle}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Banner section not created yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <CardTitle>FAQ Section</CardTitle>
                  </div>
                  {!faqLayout && <Badge variant="outline">Not Created</Badge>}
                </div>
                <CardDescription>Frequently asked questions</CardDescription>
              </CardHeader>
              <CardContent>
                {faqLayout ? (
                  <div className="space-y-3">
                    {faqLayout.faq && faqLayout.faq.length > 0 ? (
                      <>
                        {faqLayout.faq.slice(0, 3).map((item: { question: string; answer: string }, index: number) => (
                          <div key={index} className="rounded-lg border p-3">
                            <h4 className="mb-1 text-sm font-semibold">{item.question}</h4>
                            <p className="line-clamp-2 text-xs text-muted-foreground">{item.answer}</p>
                          </div>
                        ))}
                        {faqLayout.faq.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{faqLayout.faq.length - 3} more questions</p>
                        )}
                      </>
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">No FAQ items added yet</div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    FAQ section not created yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Categories Section</CardTitle>
                  </div>
                  {!categoriesLayout && <Badge variant="outline">Not Created</Badge>}
                </div>
                <CardDescription>Selected categories for display</CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesLayout ? (
                  <div className="flex flex-wrap gap-2">
                    {categoriesLayout.categories && categoriesLayout.categories.length > 0 ? (
                      <>
                        {categoriesLayout.categories.slice(0, 6).map((category: any, index: number) => {
                          const isStringCategory = typeof category === "string";
                          const categoryName = isStringCategory ? category : (category?.name || `Category ${index + 1}`);
                          const categoryId = isStringCategory ? category : (category?._id || `category-${index}`);

                          return (
                            <Badge key={categoryId} variant="secondary" className="px-3 py-1">
                              {categoryName}
                            </Badge>
                          );
                        })}
                        {categoriesLayout.categories.length > 6 && (
                          <Badge variant="outline" className="px-3 py-1">
                            +{categoriesLayout.categories.length - 6} more
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">No categories selected yet</div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Categories section not created yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutPageClient;
