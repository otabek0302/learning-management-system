"use client";

import React from "react";
import { useGetAllCoursesPublicQuery } from "@/redux/features/courses/courseApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Star, ArrowRight } from "lucide-react";

const CoursesSection = () => {
  const { data: coursesResponse, isLoading, error } = useGetAllCoursesPublicQuery({
    page: 1,
    limit: 8,
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const courses = coursesResponse?.courses || [];

  if (courses.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Courses</h2>
            <p className="text-muted-foreground">No courses available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Explore Our Courses</h2>
          <p className="text-lg text-muted-foreground">
            Discover a wide range of courses designed to help you grow and succeed
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course: any) => (
            <Card key={course._id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                {course.thumbnail?.url ? (
                  <Image
                    src={course.thumbnail.url}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-4xl font-bold text-white">{course.name?.charAt(0) || "C"}</span>
                  </div>
                )}
                {course.level && (
                  <Badge className="absolute right-2 top-2" variant="secondary">
                    {course.level}
                  </Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2">{course.name}</CardTitle>
                {course.description && (
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {course.ratings !== undefined && course.ratings > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.ratings.toFixed(1)}</span>
                    </div>
                  )}
                  {course.reviews && course.reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {(
                          course.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
                          course.reviews.length
                        ).toFixed(1)}
                      </span>
                    </div>
                  )}
                  {course.purchased !== undefined && course.purchased > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.purchased} students</span>
                    </div>
                  )}
                  {course.totalDuration && course.totalDuration > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.round(course.totalDuration / 60)} min</span>
                    </div>
                  )}
                  {course.courseData && course.courseData.length > 0 && !course.totalDuration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.round(
                          course.courseData.reduce(
                            (total: number, section: any) =>
                              total + (section.video?.duration || 0),
                            0
                          ) / 60
                        )}{" "}
                        min
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {course.price !== undefined && (
                    <span className="text-2xl font-bold text-primary">
                      ${course.price}
                    </span>
                  )}
                  {course.estimatedPrice && course.estimatedPrice > course.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${course.estimatedPrice}
                    </span>
                  )}
                </div>
                <Link href={`/courses/${course._id}`}>
                  <Button variant="outline" size="sm" className="group/btn">
                    View
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {courses.length >= 8 && (
          <div className="mt-12 text-center">
            <Link href="/courses">
              <Button size="lg" variant="outline">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;