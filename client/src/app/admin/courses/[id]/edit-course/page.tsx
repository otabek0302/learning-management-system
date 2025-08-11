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
    demoUrl: "",
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
        tags: course.tags || "",
        level: course.level || "",
        demoUrl: course.demoUrl || "",
        thumbnail: course.thumbnail?.url || "",
      });

      setBenefits(course.benefits?.length > 0 ? course.benefits : [{ title: "" }]);
      setPrerequisites(course.prerequisites?.length > 0 ? course.prerequisites : [{ title: "" }]);
      
      if (course.courseData?.length > 0) {
        setCourseContent(course.courseData.map((content: any) => ({
          videoUrl: content.videoUrl || "",
          title: content.title || "",
          description: content.description || "",
          videoSection: content.videoSection || "Untitled Section",
          links: content.links?.length > 0 ? content.links : [{ title: "", url: "" }],
          suggestion: content.suggestion || "",
        })));
      }
    }
  }, [courseData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully!");
      router.push("/admin/courses");
    }
    if (isError) {
      toast.error("Something went wrong while updating the course!");
    }
  }, [isSuccess, isError, router]);

  const handleSubmit = async () => {
    // Format the benefits and prerequisites
    const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));

    // Format the course content
    const formattedCourseContent = courseContent.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoSection: content.videoSection,
      links: content.links.map((link) => ({ title: link.title, url: link.url })),
      suggestion: content.suggestion,
    }));

    // If everything is valid, submit
    const data = {
      ...courseInfo,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContent,
    };
    
    await updateCourse({ id: courseId, data: data as any });
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