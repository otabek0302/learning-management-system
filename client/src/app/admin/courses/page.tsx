import React from "react";

const CoursesPage = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold">Course 1</h2>
        <p className="text-sm text-gray-600">This is a course</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold">Course 2</h2>
        <p className="text-sm text-gray-600">This is a course</p>
      </div>
    </div>
  );
};

export default CoursesPage;
