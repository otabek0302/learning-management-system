"use client";

import React from "react";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Shield, User, Mail, Calendar, BookOpen, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const UserDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: userData, isLoading, error, refetch } = useGetSingleUserQuery(userId, {
    refetchOnMountOrArgChange: true, // Always refetch when component mounts
  });
  const user = userData?.user;

  const handleBack = () => {
    router.push("/admin/users");
  };

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit-user`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading user details. Please try again.</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pr-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} className="cursor-pointer rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:block">Back to Users</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" onClick={handleEdit} className="cursor-pointer rounded-lg">
            <Edit className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">Edit User</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="lg:col-span-1 shadow-none">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar?.url} alt={user.name} />
                <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                  {user.role === "admin" ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                  {user.role}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={user.isVerified ? "default" : "outline"}>
                  {user.isVerified ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                  {user.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm">{format(new Date(user.createdAt), "MMM dd, yyyy")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">{format(new Date(user.updatedAt), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Activity and Courses */}
        <div className="space-y-6 lg:col-span-2">
          {/* Enrolled Courses */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Enrolled Courses
              </CardTitle>
              <CardDescription>Courses this user has enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {user.courses && user.courses.length > 0 ? (
                <div className="space-y-3">
                  {user.courses.map((course: { _id: string; courseId?: { name: string }; enrolledAt?: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{course.courseId?.name || `Course ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">Enrolled on {format(new Date((course.enrolledAt as string) || user.createdAt), "MMM dd, yyyy")}</p>
                      </div>
                      <Badge variant="outline">Enrolled</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No courses enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Additional account details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email Verification
                  </div>
                  <p className="text-sm font-medium">{user.isVerified ? "Email verified" : "Email not verified"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Account Created
                  </div>
                  <p className="text-sm font-medium">{format(new Date(user.createdAt), "MMMM dd, yyyy")}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    User ID
                  </div>
                  <p className="font-mono text-sm">{user._id}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Account Type
                  </div>
                  <p className="text-sm font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
