"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUpdateCourseMutation, useGetSingleCourseAdminQuery } from "@/redux/features/courses/courseApi";
import { useRouter, useParams } from "next/navigation";

import CreateCourseOption from "@/components/sections/admin/courses/create-course-option";
import CreateCourseInformation from "@/components/sections/admin/courses/create-course-information";
import CreateCourseData from "@/components/sections/admin/courses/create-course-data";
import CreateCourseContent from "@/components/sections/admin/courses/create-course-content";
import CreateCoursePreview from "@/components/sections/admin/courses/create-course-preview";

const EditCoursePage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [updateCourse, { isLoading, isSuccess, isError }] = useUpdateCourseMutation();
  const { data: courseData, isLoading: isLoadingCourse, error } = useGetSingleCourseAdminQuery(courseId);
  
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    categoryId: "",
    thumbnail: "",
  });
  const [courseContent, setCourseContent] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

  // Pre-populate form data when course data is loaded
  useEffect(() => {
    if (courseData?.course) {
      const course = courseData.course;
      
      setCourseInfo({
        name: course.name || "",
        description: course.description || "",
        price: course.price?.toString() || "",
        estimatedPrice: course.estimatedPrice?.toString() || "",
        tags: Array.isArray(course.tags) ? course.tags.join(", ") : course.tags || "",
        level: course.level || "",
        categoryId: course.categoryId?._id || course.categoryId || "",
        thumbnail: course.thumbnail?.secure_url || course.thumbnail?.url || "",
      });

      // Convert string array to { title: string }[] format for the form
      const benefitsArray = Array.isArray(course.benefits) 
        ? course.benefits.map((b: string | { title: string }) => ({ 
            title: typeof b === 'string' ? b : b.title || "" 
          }))
        : [{ title: "" }];
      setBenefits(benefitsArray.length > 0 ? benefitsArray : [{ title: "" }]);

      const prerequisitesArray = Array.isArray(course.prerequisites)
        ? course.prerequisites.map((p: string | { title: string }) => ({ 
            title: typeof p === 'string' ? p : p.title || "" 
          }))
        : [{ title: "" }];
      setPrerequisites(prerequisitesArray.length > 0 ? prerequisitesArray : [{ title: "" }]);
      
      if (course.courseData?.length > 0) {
        setCourseContent(course.courseData.map((content: any, index: number) => ({
          video: content.video || undefined, // Full video object from Cloudinary
          videoUrl: content.video?.secure_url || content.videoUrl || "", // For display/fallback
          title: content.title || "",
          description: content.description || "",
          videoSection: content.videoSection || `Section ${index + 1}`,
          links: content.links?.length > 0 ? content.links : [{ title: "", url: "" }],
          suggestion: content.suggestion || "",
          order: content.order !== undefined ? content.order : index,
          isPreview: content.isPreview !== undefined ? content.isPreview : false,
          isLocked: content.isLocked !== undefined ? content.isLocked : true,
          quiz: content.quiz || undefined,
        })));
      }
    }
  }, [courseData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully!");
      router.push("/admin/courses");
    }
  }, [isSuccess, router]);

  const handleSubmit = async () => {
    try {
      // Format the benefits and prerequisites - convert to string array
      const formattedBenefits = benefits.map((benefit) => benefit.title).filter((title) => title.trim() !== "");
      const formattedPrerequisites = prerequisites.map((prerequisite) => prerequisite.title).filter((title) => title.trim() !== "");

      // Format tags - convert string to array if needed
      const formattedTags = typeof courseInfo.tags === 'string' 
        ? courseInfo.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== "")
        : courseInfo.tags;

      // Format the course content
      const formattedCourseContent = courseContent.map((content) => {
        const formatted: any = {
          title: content.title,
          description: content.description,
          videoSection: content.videoSection,
          links: content.links.map((link) => ({ title: link.title, url: link.url })),
          suggestion: content.suggestion || "",
          order: content.order !== undefined ? content.order : 0,
          isPreview: content.isPreview !== undefined ? content.isPreview : false,
          isLocked: content.isLocked !== undefined ? content.isLocked : true,
        };

        // Priority: 1. Use video object if it exists (existing or already uploaded)
        //           2. Use videoUrl if it's base64 (new upload)
        if (content.video && content.video.public_id) {
          formatted.video = content.video;
        } else if (content.videoUrl && content.videoUrl.startsWith('data:')) {
          // New video upload (base64)
          formatted.videoUrl = content.videoUrl;
        }
        // Note: If videoUrl is a regular URL (not base64), we don't send it
        // Backend will use existing video from database

        // Include quiz if exists
        if (content.quiz) {
          formatted.quiz = content.quiz;
        }

        return formatted;
      });

      // If everything is valid, submit
      const data = {
        ...courseInfo,
        price: courseInfo.price ? parseFloat(courseInfo.price) : undefined,
        estimatedPrice: courseInfo.estimatedPrice ? parseFloat(courseInfo.estimatedPrice) : undefined,
        tags: formattedTags,
        benefits: formattedBenefits,
        prerequisites: formattedPrerequisites,
        courseData: formattedCourseContent,
      };
      
      await updateCourse({ id: courseId, data }).unwrap();
    } catch (error: any) {
      // Show detailed validation errors if available
      if (error?.data?.fields) {
        const errorMessages = Object.values(error.data.fields).flat().join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(error?.data?.message || "Failed to update course. Please try again.");
      }
      console.error("Course update error:", error);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading course. Please try again.</p>
          <button 
            onClick={() => router.push("/admin/courses")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <CreateCourseOption active={active} setActive={setActive} />
      {active === 0 && <CreateCourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} errors={errors} setErrors={setErrors} setActive={setActive} active={active} />}
      {active === 1 && <CreateCourseData benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} setErrors={setErrors} errors={errors} setActive={setActive} active={active} />}
      {active === 2 && <CreateCourseContent courseContent={courseContent} setCourseContent={setCourseContent} setErrors={setErrors} errors={errors} setActive={setActive} active={active} />}
      {active === 3 && <CreateCoursePreview courseData={{ ...courseInfo, benefits, prerequisites, courseContent }} active={active} setActive={setActive} handleSubmit={handleSubmit} isLoading={isLoading} />}
    </div>
  );
};

export default EditCoursePage;