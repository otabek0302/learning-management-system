"use client";
import * as Yup from "yup";
import { useState } from "react";

import CreateCourseOption from "@/components/sections/admin/courses/create-course-option";
import CreateCourseInformation from "@/components/sections/admin/courses/create-course-information";
import CreateCourseData from "@/components/sections/admin/courses/create-course-data";
import CreateCourseContent from "@/components/sections/admin/courses/create-course-content";
import CreateCoursePreview from "@/components/sections/admin/courses/create-course-preview";

const schema = Yup.object().shape({
  name: Yup.string().required("Course name is required").min(3, "Course name must be at least 3 characters").max(100, "Course name must not exceed 100 characters"),
  description: Yup.string().required("Course description is required").min(10, "Description must be at least 10 characters").max(500, "Description must not exceed 500 characters"),
  price: Yup.number().required("Price is required").positive("Price must be a positive number").min(0, "Price cannot be negative"),
  estimatedPrice: Yup.number().positive("Estimated price must be a positive number").min(0, "Estimated price cannot be negative"),
  tags: Yup.string().required("Tags are required").min(2, "At least one tag is required"),
  level: Yup.string().required("Course level is required").oneOf(["Beginner", "Intermediate", "Advanced"], "Please select a valid level"),
  demoUrl: Yup.string().required("Demo URL is required").url("Please enter a valid URL"),
  thumbnail: Yup.string().required("Thumbnail is required"),
});

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

  const validateAndSubmit = async () => {
    const combinedErrors: Record<string, string> = {};

    // 1️⃣ Validate courseInfo with Yup
    try {
      await schema.validate(courseInfo, { abortEarly: false });
    } catch (validationError: any) {
      if (validationError.inner) {
        validationError.inner.forEach((err: any) => {
          combinedErrors[err.path] = err.message;
        });
      }
    }

    // 2️⃣ Validate benefits manually (example: ensure titles are not empty)
    benefits.forEach((benefit, idx) => {
      if (!benefit.title.trim()) {
        combinedErrors[`benefit_${idx}`] = "Benefit title cannot be empty";
      }
    });

    // 3️⃣ Validate prerequisites manually
    prerequisites.forEach((pre, idx) => {
      if (!pre.title.trim()) {
        combinedErrors[`prerequisite_${idx}`] = "Prerequisite title cannot be empty";
      }
    });

    // 4️⃣ Validate course content manually (example: check video URL and title)
    courseContent.forEach((content, idx) => {
      if (!content.title.trim()) {
        combinedErrors[`content_title_${idx}`] = "Content title cannot be empty";
      }
      if (!content.videoUrl.trim()) {
        combinedErrors[`content_videoUrl_${idx}`] = "Content video URL cannot be empty";
      }
    });

    // Update error state
    setErrors(combinedErrors);

    if (Object.keys(combinedErrors).length > 0) {
      console.error("Validation failed:", combinedErrors);
      alert("Please fix validation errors before submitting.");
      return;
    }

    // If everything is valid, submit
    const finalPayload = {
      ...courseInfo,
      benefits,
      prerequisites,
      courseContent,
      courseData,
    };
    console.log("Final payload:", finalPayload);
    alert("Course created successfully!");
  };

  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

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
  const [courseData, setCourseData] = useState({});

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <CreateCourseOption active={active} setActive={setActive} />
      {active === 0 && <CreateCourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} errors={errors} setErrors={setErrors} setActive={setActive} active={active} />}
      {active === 1 && <CreateCourseData benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} errors={errors} setActive={setActive} active={active} />}
      {active === 2 && <CreateCourseContent courseContent={courseContent} setCourseContent={setCourseContent} errors={errors} setActive={setActive} active={active} />}
      {active === 3 && <CreateCoursePreview />}
    </div>
  );
};

export default CreateCoursePage;
