import React from "react";

import { Layout } from "@/shared/interfaces";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, ImageIcon, HelpCircle, FolderOpen } from "lucide-react";
import Image from "next/image";

interface LayoutPagePreviewProps {
  layout: Layout & {
    categories?: Array<string | { _id: string; name: string; description?: string }>;
  };
  onView: (layoutId: string) => void;
  onEdit: (layoutId: string) => void;
  onDelete: (layoutId: string) => void;
}

const LayoutPagePreview: React.FC<LayoutPagePreviewProps> = ({ layout, onView, onEdit, onDelete }) => {
  const layouts_pages_types = [
    { type: "banner", label: "Banner", description: "Hero section with image and text", icon: ImageIcon },
    { type: "faq", label: "FAQ", description: "Frequently asked questions", icon: HelpCircle },
    { type: "categories", label: "Categories", description: "Selected categories for display", icon: FolderOpen },
  ];

  const getLayoutByType = (type: string) => {
    return layouts_pages_types.find((layout) => layout.type === type);
  };

  const renderBannerPreview = (layout: Layout) => (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
      {layout.banner?.image?.url ? (
        <Image
          src={layout.banner.image.url}
          alt={layout.banner?.title || "Banner"}
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
          <h3 className="mb-2 text-xl font-bold">{layout.banner?.title || "Banner Title"}</h3>
          {layout.banner?.subTitle && <p className="text-sm">{layout.banner.subTitle}</p>}
        </div>
      </div>
    </div>
  );

  const renderFaqPreview = (layout: Layout) => (
    <div className="space-y-3">
      {layout.faq && layout.faq.length > 0 ? (
        <>
          {layout.faq.slice(0, 3).map((item, index) => (
            <div key={index} className="rounded-lg border p-3">
              <h4 className="mb-1 text-sm font-semibold">{item.question}</h4>
              <p className="line-clamp-2 text-xs text-muted-foreground">{item.answer}</p>
            </div>
          ))}
          {layout.faq.length > 3 && (
            <p className="text-xs text-muted-foreground">+{layout.faq.length - 3} more questions</p>
          )}
        </>
      ) : (
        <div className="py-4 text-center text-sm text-muted-foreground">No FAQ items added yet</div>
      )}
    </div>
  );

  const renderCategoriesPreview = (layout: Layout & { categories?: Array<string | { _id: string; name: string; description?: string }> }) => {
    const categories = layout.categories || [];
    
    if (categories.length === 0) {
      return (
        <div className="py-4 text-center text-sm text-muted-foreground">
          No categories selected yet
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 6).map((category, index) => {
          const isStringCategory = typeof category === "string";
          const categoryName = isStringCategory ? category : (category as { name: string }).name;
          const categoryId = isStringCategory ? category : (category as { _id: string })._id;
          
          return (
            <Badge key={categoryId || `category-${index}`} variant="secondary" className="px-3 py-1">
              {categoryName || `Category ${index + 1}`}
            </Badge>
          );
        })}
        {categories.length > 6 && (
          <Badge variant="outline" className="px-3 py-1">
            +{categories.length - 6} more
          </Badge>
        )}
      </div>
    );
  };

  const renderPreview = (layout: Layout & { categories?: Array<string | { _id: string; name: string; description?: string }> }) => {
    switch (layout.type) {
      case "banner":
        return renderBannerPreview(layout);
      case "faq":
        return renderFaqPreview(layout);
      case "categories":
        return renderCategoriesPreview(layout);
      default:
        return <div className="text-sm text-muted-foreground">No preview available</div>;
    }
  };

  const layoutTypeInfo = getLayoutByType(layout.type);
  const LayoutIcon = layoutTypeInfo?.icon || FolderOpen;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LayoutIcon className="h-5 w-5 text-primary" />
          <CardTitle>{layoutTypeInfo?.label || layout.type}</CardTitle>
        </div>
        <CardDescription>{layoutTypeInfo?.description || "Layout configuration"}</CardDescription>
      </CardHeader>
      <CardContent>{renderPreview(layout)}</CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onView?.(layout._id)} className="group/btn flex-1 cursor-pointer items-center gap-1 hover:bg-blue-500 hover:text-white">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(layout._id)} className="group/btn flex-1 cursor-pointer items-center gap-1 hover:bg-green-500 hover:text-white">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete?.(layout._id)} className="group/btn flex-1 cursor-pointer items-center gap-1 hover:bg-red-500 hover:text-white">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LayoutPagePreview;
