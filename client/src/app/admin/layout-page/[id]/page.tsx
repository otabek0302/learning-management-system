"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useGetLayoutQuery } from "@/redux/features/layout-page/layoutApi";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Eye, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const SingleLayoutPage = () => {
  const router = useRouter();
  const params = useParams();
  const layoutType = params.id as string;
  const { data: layoutResponse, isLoading, error, refetch } = useGetLayoutQuery(layoutType);

  const layout = layoutResponse?.layout;

  const renderBannerLayout = () => (
    <div className="relative min-h-screen overflow-hidden rounded-xl">
      {layout?.banner?.image?.url ? <Image src={layout.banner.image.url} alt={layout.banner.title || "Banner"} fill className="object-cover" /> : <div className="absolute inset-0 bg-black/50" />}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="text-center text-white">
          <h2 className="mb-4 text-4xl font-bold md:text-6xl">{layout?.banner?.title || "Welcome to Our Platform"}</h2>
          <p className="text-xl text-gray-200 md:text-2xl">{layout?.banner?.subTitle || "Discover amazing courses and learn from experts"}</p>
          <div className="mt-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFaqLayout = () => (
    <div className="w-full space-y-6">
      {/* FAQ Header */}
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-600">Find answers to common questions about our platform</p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {layout?.faq?.map((item: { question: string; answer: string }, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-gray-600">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCategoriesLayout = () => (
    <div className="w-full space-y-6">
      {/* Categories Header */}
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">Course Categories</h2>
        <p className="text-xl text-gray-600">Explore our diverse range of learning categories</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {layout?.categories?.map((category: { title: string }, index: number) => (
          <Card key={index} className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Explore courses</span>
                <Badge variant="secondary" className="group-hover:bg-blue-100">
                  {Math.floor(Math.random() * 50) + 10} courses
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLayoutByType = () => {
    switch (layoutType) {
      case "banner":
        return renderBannerLayout();
      case "faq":
        return renderFaqLayout();
      case "categories":
        return renderCategoriesLayout();
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Layout Type Not Found</h2>
            <p className="text-gray-600">The requested layout type is not available.</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-xl text-muted-foreground">Loading layout preview...</p>
        </div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-destructive">Layout Not Found</h2>
          <p className="mb-6 text-gray-600">The requested layout could not be loaded.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:block">Back to Layout Page</span>
            </Button>
            <Button onClick={() => router.push("/admin/layout-page")}>View All Layouts</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:block">Back</span>
            </Button>
          </div>

                     <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               onClick={() => refetch()} 
               className="flex items-center gap-2"
               title="Refresh data"
             >
               <RefreshCw className="h-4 w-4" />
               <span className="hidden sm:block">Refresh</span>
             </Button>
             <Button variant="outline" onClick={() => router.push(`/admin/layout-page/${layout._id}/edit-layout-page`)} className="flex items-center gap-2">
               <Edit className="h-4 w-4" />
               <span className="hidden sm:block">Edit Layout</span>
             </Button>
             <Button onClick={() => router.push("/admin/layout-page")} className="flex items-center gap-2">
               <Eye className="h-4 w-4" />
               <span className="hidden sm:block">View All Layouts</span>
             </Button>
           </div>
        </div>
      </div>

      <div className="p-4">{renderLayoutByType()}</div>
    </div>
  );
};

export default SingleLayoutPage;
