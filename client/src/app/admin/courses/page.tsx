"use client";

import React from "react";
import CourseCard from "@/components/sections/admin/courses/course-card";

import { useState } from "react";
import { Grid3X3, List, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllCoursesQuery, useDeleteCourseMutation } from "@/redux/features/courses/courseApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

const CoursesPage = () => {
  const router = useRouter();

  const [layout, setLayout] = useState<"column" | "row">("column");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { data: coursesData, isLoading, error } = useGetAllCoursesQuery({ page: currentPage, limit: rowsPerPage });
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const courses = coursesData?.courses || [];
  const pagination = coursesData?.pagination;

  interface Course {
    _id: string;
    name: string;
    description: string;
    tags: string | string[];
  }

  const filteredCourses = courses.filter((course: Course) => {
    const tagsString = Array.isArray(course.tags) ? course.tags.join(" ") : course.tags;
    return (
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagsString.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleView = (courseId: string) => {
    router.push(`/admin/courses/${courseId}`);
  };

  const handleEdit = (courseId: string) => {
    router.push(`/admin/courses/${courseId}/edit-course`);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await deleteCourse(courseId).unwrap();
        toast.success("Course deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete course");
      }
    }
  };

  const handleCreateCourse = () => {
    router.push("/admin/courses/create-course");
  };

  if (isLoading || isDeleting) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading courses. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pr-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-10 shadow-none focus-visible:ring-1" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant={layout === "column" ? "default" : "outline"} onClick={() => setLayout("column")} className="cursor-pointer rounded-lg">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:block">Grid</span>
          </Button>
          <Button variant={layout === "row" ? "default" : "outline"} onClick={() => setLayout("row")} className="cursor-pointer rounded-lg">
            <List className="h-4 w-4" />
            <span className="hidden sm:block">List</span>
          </Button>
          <Button variant="default" className="cursor-pointer rounded-lg" onClick={handleCreateCourse}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:block">Create Course</span>
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-18rem)] flex flex-col gap-4">
        {/* Courses Grid/List */}
        {filteredCourses.length == 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="text-center">
              <p className="text-muted-foreground">{searchTerm ? "No courses found matching your search." : "No courses available."}</p>
              {!searchTerm && (
                <Button variant="default" className="mt-4 cursor-pointer rounded-lg" onClick={handleCreateCourse}>
                  Create your first course
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={layout === "column" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
            {filteredCourses.map((course: Course) => (
              <CourseCard key={course._id} course={course} layout={layout} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          count={pagination.totalCourses}
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

export default CoursesPage;
