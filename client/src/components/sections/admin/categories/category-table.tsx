import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import { format } from "date-fns";
import { CategoryTableActions } from "./category-table-actions";

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryTableProps {
  categories: Category[];
  onView: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onView, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-4">Category</TableHead>
            <TableHead className="px-2">Description</TableHead>
            <TableHead className="px-2">Created</TableHead>
            <TableHead className="px-2">Updated</TableHead>
            <TableHead className="w-[50px] px-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Folder className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">{category.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground line-clamp-2">
                  {category.description || "No description"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {category.createdAt ? format(new Date(category.createdAt), "MMM dd, yyyy") : "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {category.updatedAt ? format(new Date(category.updatedAt), "MMM dd, yyyy") : "N/A"}
                </span>
              </TableCell>
              <TableCell className="flex justify-center">
                <CategoryTableActions category={category} onView={onView} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;

