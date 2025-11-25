import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryTableActionsProps {
  category: Category;
  onView: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
}

export const CategoryTableActions: React.FC<CategoryTableActionsProps> = ({ category, onView, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(category._id)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(category._id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(category._id)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

