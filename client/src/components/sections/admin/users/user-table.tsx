import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, User } from "lucide-react";
import { format } from "date-fns";
import { UserTableActions } from "./user-table-actions";

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

interface UserTableProps {
  users: User[];
  onView: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string, role: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onView, onEdit, onDelete, onRoleChange }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "destructive" : "secondary";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="px-4">User</TableHead>
            <TableHead className="px-2">Email</TableHead>
            <TableHead className="px-2">Role</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Courses</TableHead>
            <TableHead className="px-2">Joined</TableHead>
            <TableHead className="w-[50px] px-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar?.url} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{user.name}</p>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role === "admin" ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isVerified ? "default" : "outline"}>{user.isVerified ? "Verified" : "Unverified"}</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{user.courses?.length || 0} courses</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{format(new Date(user.createdAt), "MMM dd, yyyy")}</span>
              </TableCell>
              <TableCell className="flex justify-center">
                <UserTableActions user={user} onView={onView} onEdit={onEdit} onDelete={onDelete} onRoleChange={onRoleChange} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
