import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-2xl">Oops! Page not found.</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
