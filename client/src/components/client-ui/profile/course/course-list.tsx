"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CourseCard from "./course-card";

const CourseList = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(courses);
  }, []);

  if (courses.length === 0) {
    return (
      <div className="mt-4 flex h-72 items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">{t("messages.errors.no-courses")}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} />
      ))}
    </div>
  );
};

export default CourseList;
