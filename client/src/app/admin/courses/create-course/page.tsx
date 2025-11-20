"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useCreateCourseMutation } from "@/redux/features/courses/courseApi";
import { useRouter } from "next/navigation";

import CreateCourseOption from "@/components/sections/admin/courses/create-course-option";
import CreateCourseInformation from "@/components/sections/admin/courses/create-course-information";
import CreateCourseData from "@/components/sections/admin/courses/create-course-data";
import CreateCourseContent from "@/components/sections/admin/courses/create-course-content";
import CreateCoursePreview from "@/components/sections/admin/courses/create-course-preview";

const CreateCoursePage = () => {
  const router = useRouter();
  
  const [createCourse, { isLoading, isSuccess, isError }] = useCreateCourseMutation();
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    category: "",
    demoUrl: "",
    thumbnail: "",
  });
  
  const [courseContent, setCourseContent] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength: 0,
      links: [{ title: "", url: "" }],
      suggestion: "",
      order: 0,
      isPreview: false,
      isLocked: true,
    },
  ]);
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    }
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isSuccess, isError, router]);

  const handleSubmit = async () => {
    try {
      // Format the benefits and prerequisites - convert to string array
      const formattedBenefits = benefits.map((benefit) => benefit.title).filter((title) => title.trim() !== "");
      const formattedPrerequisites = prerequisites.map((prerequisite) => prerequisite.title).filter((title) => title.trim() !== "");

      // Format tags - convert string to array if needed
      const formattedTags = typeof courseInfo.tags === 'string' 
        ? courseInfo.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== "")
        : courseInfo.tags;

      // Format the course content with new fields
      const formattedCourseContent = courseContent.map((content, index) => ({
        videoUrl: content.videoUrl,
        title: content.title,
        description: content.description,
        videoLength: content.videoLength || 0,
        videoSection: content.videoSection,
        links: content.links.map((link) => ({ title: link.title, url: link.url })),
        suggestion: content.suggestion,
        order: content.order !== undefined ? content.order : index,
        isPreview: content.isPreview !== undefined ? content.isPreview : false,
        isLocked: content.isLocked !== undefined ? content.isLocked : true,
        // Include quiz if it exists (will be added later in UI)
        ...(content.quiz && { quiz: content.quiz }),
      }));

      // If everything is valid, submit
      const data = {
        ...courseInfo,
        tags: formattedTags,
        benefits: formattedBenefits,
        prerequisites: formattedPrerequisites,
        courseData: formattedCourseContent,
      };
      await createCourse(data).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create course. Please try again.");
    }
  };

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

export default CreateCoursePage;
