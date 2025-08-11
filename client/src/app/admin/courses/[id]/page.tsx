"use client";

import Image from "next/image";

import { useGetSingleCourseQuery, useDeleteCourseMutation } from "@/redux/features/courses/courseApi";
import { Users, Star, Edit, Trash2, ArrowLeft, Video, MessageCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { CoursePlayer } from "@/components/sections/admin/courses/course-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/helper";
import { AccordionSections } from "@/components/sections/admin/courses/course-accordion-content";

const CourseDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data, isLoading, error } = useGetSingleCourseQuery(courseId);
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const course = data?.course;

  const handleEdit = () => {
    router.push(`/admin/courses/${courseId}/edit-course`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(courseId);
      router.push("/admin/courses");
    }
  };

  const handleBack = () => {
    router.push("/admin/courses");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading course. Please try again.</p>
          <Button variant="outline" className="mt-4" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 pt-4">
        <Button variant="outline" onClick={handleBack} className="cursor-pointer rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-sm font-semibold">Back</span>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit} className="cursor-pointer rounded-lg">
            <Edit className="mr-1 h-4 w-4" />
            <span className="text-sm font-semibold">Edit</span>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="cursor-pointer rounded-lg">
            <Trash2 className="mr-1 h-4 w-4" />
            <span className="text-sm font-semibold">{isDeleting ? "Deleting..." : "Delete"}</span>
          </Button>
        </div>
      </div>

      {/* Thumbnail & Demo Video */}
      <div className="space-y-4 py-4">
        <div className="relative h-56 w-full overflow-hidden rounded-lg">
          <Image src={course.thumbnail?.url || "/placeholder-course.jpg"} alt={course.name} fill className="object-cover" />
        </div>
        <div className="space-y-2">
          <div>
            <h3 className="flex items-center gap-2 text-4xl font-bold text-foreground">{course.name}</h3>
            <p className="text-sm font-light text-muted-foreground">{course.description}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {course.tags.split(",").map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
          <div className="py-4 flex flex-wrap gap-6 text-base">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.ratings?.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.purchased} students</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{course.reviews?.length || 0} reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="rounded-lg">{course.level}</Badge>
            <div className="flex items-center gap-1">
              <span className="mr-2 text-xs text-muted-foreground line-through">{formatPrice(course.price)}</span>
              <span className="font-semibold text-primary">{formatPrice(course.estimatedPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video */}
      {course.demoUrl && (
        <div className="mb-8">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <Video className="h-5 w-5" /> Demo Video
          </h2>
          <div className="rounded-lg border bg-background p-2">
            <CoursePlayer videoUrl={course.demoUrl} />
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <h4 className="mb-2 text-lg font-semibold text-foreground">Description</h4>
        <p className="whitespace-pre-line text-base text-muted-foreground">{course.description}</p>
      </div>

      {/* Benefits */}
      {course.benefits && course.benefits.length > 0 && (
        <div className="mb-8">
          <h4 className="mb-2 text-lg font-semibold text-foreground">Benefits</h4>
          <ul className="list-disc space-y-1 pl-6">
            {course.benefits.map((b: any) => (
              <li key={b._id} className="text-base text-muted-foreground">
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mb-8">
          <h4 className="mb-2 text-lg font-semibold text-foreground">Prerequisites</h4>
          <ul className="list-disc space-y-1 pl-6">
            {course.prerequisites.map((p: any) => (
              <li key={p._id} className="text-base text-muted-foreground">
                {p.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Divider */}
      <div className="my-6 h-px w-full bg-muted" />

      {/* Course Content/Sections */}
      <div>
        <h4 className="mb-4 text-xl font-semibold text-foreground">Course Content</h4>
        {course.courseData && course.courseData.length > 0 ? <AccordionSections sections={course.courseData} /> : <p className="text-muted-foreground">No course content available.</p>}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
