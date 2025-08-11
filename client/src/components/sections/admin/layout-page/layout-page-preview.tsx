import React from "react";

import { Layout } from "@/interfaces/layout.interface";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

interface LayoutPagePreviewProps {
  layout: Layout;
  onView: (layoutId: string) => void;
  onEdit: (layoutId: string) => void;
  onDelete: (layoutId: string) => void;
}

const LayoutPagePreview: React.FC<LayoutPagePreviewProps> = ({ layout, onView, onEdit, onDelete }) => {
  const layouts_pages_types = [
    { type: "banner", label: "Banner", description: "Hero section with image and text" },
    { type: "faq", label: "FAQ", description: "Frequently asked questions" },
    { type: "categories", label: "Categories", description: "Course categories list" },
  ];

  const getLayoutByType = (type: string) => {
    return layouts_pages_types.find((layout) => layout.type === type);
  };

  const renderBannerPreview = (layout: Layout) => (
    <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
      {layout.banner?.image?.url && <img src={layout.banner.image.url} alt="Banner" className="h-full w-full object-cover" />}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div className="text-center text-white">
          <h3 className="mb-2 text-xl font-bold">{layout.banner?.title || "Banner Title"}</h3>
          <p className="text-sm">{layout.banner?.subTitle || "Banner Subtitle"}</p>
        </div>
      </div>
    </div>
  );

  const renderFaqPreview = (layout: Layout) => (
    <div className="space-y-3">
      {layout.faq?.slice(0, 3).map((item, index) => (
        <div key={index} className="rounded-lg border p-3">
          <h4 className="mb-1 text-sm font-semibold">{item.question}</h4>
          <p className="line-clamp-2 text-xs text-gray-600">{item.answer}</p>
        </div>
      ))}
      {layout.faq && layout.faq.length > 3 && <p className="text-xs text-gray-500">+{layout.faq.length - 3} more questions</p>}
    </div>
  );

  const renderCategoriesPreview = (layout: Layout) => (
    <div className="flex flex-wrap gap-2">
      {layout.categories?.slice(0, 6).map((category, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {category.title}
        </Badge>
      ))}
      {layout.categories && layout.categories.length > 6 && (
        <Badge variant="outline" className="text-xs">
          +{layout.categories.length - 6} more
        </Badge>
      )}
    </div>
  );

  const renderPreview = (layout: Layout) => {
    switch (layout.type) {
      case "banner":
        return renderBannerPreview(layout);
      case "faq":
        return renderFaqPreview(layout);
      case "categories":
        return renderCategoriesPreview(layout);
      default:
        return <div className="text-sm text-gray-500">No preview available</div>;
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300">
      <CardHeader>
        <CardTitle>{getLayoutByType(layout.type)?.label}</CardTitle>
        <CardDescription>{getLayoutByType(layout.type)?.description}</CardDescription>
      </CardHeader>
      <CardContent>{renderPreview(layout)}</CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onView?.(layout.type)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-blue-500">
            <Eye className="h-4 w-4 group-hover/btn:text-white" />
            <span className="hidden group-hover/btn:text-white sm:block">View</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(layout._id)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-green-500">
            <Edit className="h-4 w-4 group-hover/btn:text-white" />
            <span className="hidden group-hover/btn:text-white sm:block">Edit</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete?.(layout._id)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-red-500">
            <Trash2 className="h-4 w-4 group-hover/btn:text-white" />
            <span className="hidden group-hover/btn:text-white sm:block">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LayoutPagePreview;
