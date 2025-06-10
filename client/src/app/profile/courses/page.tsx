"use client";

import { Protected } from "@/hooks/useProtected";

import CourseToolbar from "@/components/client-ui/profile/course/course-toolbar";
import CourseList from "@/components/client-ui/profile/course/course-list";

const CoursesPage = () => {
  return (
    <Protected>
      <div className="h-full overflow-y-auto p-4">
        <CourseToolbar />
        <CourseList />
      </div>
    </Protected>
  );
};

export default CoursesPage;