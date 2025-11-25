"use client";

import React from "react";
import Image from "next/image";
import { useGetLayoutQuery } from "@/redux/features/layout-page/layoutApi";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  const { data: layoutResponse, isLoading } = useGetLayoutQuery("banner");

  if (isLoading) {
    return (
      <section className="relative min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading hero section...</p>
        </div>
      </section>
    );
  }

  const layout = layoutResponse?.layout;
  const banner = layout?.banner;

  if (!banner) {
    return null;
  }

  return (
    <section className="relative min-h-[600px] overflow-hidden rounded-xl">
      {banner.image?.url ? (
        <div className="absolute inset-0">
          <Image
            src={banner.image.url}
            alt={banner.title || "Hero Banner"}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
      )}
      
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl lg:text-7xl">
            {banner.title || "Welcome to Our Platform"}
          </h1>
          <p className="mb-8 text-xl text-gray-200 md:text-2xl lg:text-3xl">
            {banner.subTitle || "Discover amazing courses and learn from experts"}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

