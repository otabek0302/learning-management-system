"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import HeroSection from "@/components/sections/home/hero-section";
import CoursesSection from "@/components/sections/home/courses-section";
import FAQSection from "@/components/sections/home/faq-section";

const Home = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user was redirected due to access denied
    const accessDenied = searchParams.get("access");
    if (accessDenied === "denied") {
      toast.error("Access denied. You don't have permission to access that page.");
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      {/* <HeroSection /> */}

      {/* Courses Section */}
      {/* <CoursesSection /> */}

      {/* FAQ Section */}
      {/* <FAQSection /> */}
    </main>
  );
};

export default Home;
