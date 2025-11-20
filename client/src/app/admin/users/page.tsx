"use client";

import UserTable from "@/components/sections/admin/users/user-table";
import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation } from "@/redux/features/users/userApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

const UsersPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery({ page: currentPage, limit: rowsPerPage });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  // Filter users by search term and role
  interface User {
    name: string;
    email: string;
    role: string;
  }

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get counts for each role
  const userCounts = {
    all: users.length,
    user: users.filter((user: User) => user.role === "user").length,
    admin: users.filter((user: User) => user.role === "admin").length,
  };

  const handleView = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleEdit = (userId: string) => {
    router.push(`/admin/users/${userId}/edit-user`);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user role");
    }
  };

  const handleCreateUser = () => {
    router.push("/admin/users/create-user");
  };

  if (isLoading || isDeleting || isUpdatingRole) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading users. Please try again.</p>
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
            <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-10 shadow-none focus-visible:ring-1" />
          </div>

          {/* Filter Status */}
          {(searchTerm || roleFilter !== "all") && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
              {searchTerm && ` matching "${searchTerm}"`}
              {roleFilter !== "all" && ` (${roleFilter}s only)`}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter Buttons */}
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button variant={roleFilter === "all" ? "default" : "ghost"} size="sm" onClick={() => setRoleFilter("all")} className="h-8 px-3">
              <Users className="mr-1 h-3 w-3" />
              All ({userCounts.all})
            </Button>
            <Button variant={roleFilter === "user" ? "default" : "ghost"} size="sm" onClick={() => setRoleFilter("user")} className="h-8 px-3">
              <Users className="mr-1 h-3 w-3" />
              Users ({userCounts.user})
            </Button>
            <Button variant={roleFilter === "admin" ? "default" : "ghost"} size="sm" onClick={() => setRoleFilter("admin")} className="h-8 px-3">
              <Shield className="mr-1 h-3 w-3" />
              Admins ({userCounts.admin})
            </Button>
          </div>

          <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateUser}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:block">Create User</span>
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-18rem)] flex-col gap-4">
        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="text-center">
              <p className="text-muted-foreground">{searchTerm || roleFilter !== "all" ? `No ${roleFilter === "all" ? "" : roleFilter}s found matching your criteria.` : "No users available."}</p>
              {!searchTerm && roleFilter === "all" && (
                <Button variant="default" className="mt-4 cursor-pointer rounded-lg" onClick={handleCreateUser}>
                  Create your first user
                </Button>
              )}
            </div>
          </div>
        ) : (
          <UserTable users={filteredUsers} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} onRoleChange={handleRoleChange} />
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          count={pagination.totalUsers}
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

export default UsersPage;
