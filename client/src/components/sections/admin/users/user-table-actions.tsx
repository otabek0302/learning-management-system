import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Shield } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: {
    url: string;
  };
  createdAt: string;
  courses: any[];
}

interface UserTableActionsProps {
  user: User;
  onView: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string, role: string) => void;
}

export const UserTableActions: React.FC<UserTableActionsProps> = ({ user, onView, onEdit, onDelete, onRoleChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(user._id)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user._id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRoleChange(user._id, user.role === "admin" ? "user" : "admin")}>
          <Shield className="mr-2 h-4 w-4" />
          {user.role === "admin" ? "Make User" : "Make Admin"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(user._id)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
