"use client";

import { useState } from "react";
import { toast } from "sonner";

import CreateCourseOption from "@/components/sections/admin/courses/create-course-option";
import CreateCourseInformation from "@/components/sections/admin/courses/create-course-information";
import CreateCourseData from "@/components/sections/admin/courses/create-course-data";
import CreateCourseContent from "@/components/sections/admin/courses/create-course-content";
import CreateCoursePreview from "@/components/sections/admin/courses/create-course-preview";

const CreateCoursePage = () => {
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
      courseContent: formattedCourseContent,
    };
    toast.success("Course created successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <CreateCourseOption active={active} setActive={setActive} />
      {active === 0 && <CreateCourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} errors={errors} setErrors={setErrors} setActive={setActive} active={active} />}
      {active === 1 && <CreateCourseData benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} setErrors={setErrors} errors={errors} setActive={setActive} active={active} />}
      {active === 2 && <CreateCourseContent courseContent={courseContent} setCourseContent={setCourseContent} setErrors={setErrors} errors={errors} setActive={setActive} active={active} />}
      {active === 3 && <CreateCoursePreview courseData={{ ...courseInfo, benefits, prerequisites, courseContent }} active={active} setActive={setActive} handleSubmit={handleSubmit} />}
    </div>
  );
};

export default CreateCoursePage;
