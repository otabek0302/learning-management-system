import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Oops! Page not found.</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
