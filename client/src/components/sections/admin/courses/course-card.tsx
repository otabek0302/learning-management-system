import React from "react";
import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Eye, Trash2, Users, Star, DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Course {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string | string[];
  level: string;
  ratings: number;
  purchased: number;
  createdAt: string;
}

interface CourseCardProps {
  course: Course;
  layout: "column" | "row";
  onEdit?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, layout, onEdit, onView, onDelete }) => {
  if (layout === "row") {
    return (
      <Card className="group overflow-hidden transition-all duration-300">
        <div className="flex">
          {/* Course Thumbnail */}
          <div className="relative w-80 flex-shrink-0 overflow-hidden">
            <Image src={course.thumbnail.url || "/placeholder-course.jpg"} alt={course.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute right-3 top-3 flex items-center">
              <Badge variant={course.level.toLowerCase() as "beginner" | "intermediate" | "advanced"}>{course.level}</Badge>
              <Badge variant="destructive" className="ml-2 text-xs">
                {course.estimatedPrice && course.estimatedPrice < course.price && `${Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)}%`}
              </Badge>
            </div>
          </div>

          {/* Course Content */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-4">
              <div>
                <h3 className="line-clamp-2 text-xl font-bold text-foreground">{course.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.purchased} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.ratings.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {course.estimatedPrice && course.estimatedPrice < course.price ? (
                    <>
                      <span className="mr-2 text-xs text-muted-foreground line-through">{formatPrice(course.price)}</span>
                      <span className="font-semibold text-primary">{formatPrice(course.estimatedPrice)}</span>
                    </>
                  ) : (
                    <span>{formatPrice(course.price)}</span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(course.tags) ? course.tags : course.tags.split(",")).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs hover:bg-secondary/80">
                    {typeof tag === 'string' ? tag.trim() : tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onView?.(course._id)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-blue-500">
                  <Eye className="h-4 w-4 group-hover/btn:text-white" />
                  <span className="hidden group-hover/btn:text-white sm:block">View</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit?.(course._id)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-green-500">
                  <Edit className="h-4 w-4 group-hover/btn:text-white" />
                  <span className="hidden group-hover/btn:text-white sm:block">Edit</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete?.(course._id)} className="group/btn flex cursor-pointer items-center gap-1 rounded-lg hover:bg-red-500">
                  <Trash2 className="h-4 w-4 group-hover/btn:text-white" />
                  <span className="hidden group-hover/btn:text-white sm:block">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Column layout
  return (
    <Card className="group overflow-hidden transition-all duration-300">
      {/* Course Thumbnail */}
      <div className="relative h-52 overflow-hidden">
        <Image src={course.thumbnail.url || "/placeholder-course.jpg"} alt={course.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute right-3 top-3 flex items-center">
          <Badge variant={course.level.toLowerCase() as "beginner" | "intermediate" | "advanced"}>{course.level}</Badge>
          <Badge variant="destructive" className="ml-2 text-xs">
            {course.estimatedPrice && course.estimatedPrice < course.price && `${Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)}%`}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <CardHeader className="p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-lg font-bold text-foreground">{course.name}</h3>
          <p className="line-clamp-2 text-sm font-light text-muted-foreground">{course.description}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Tags */}
        <div className="flex h-14 flex-wrap gap-1">
          {(Array.isArray(course.tags) ? course.tags : course.tags.split(","))
            .slice(0, 3)
            .map((tag, index) => (
              <Badge key={index} variant="secondary" className="h-6 text-xs hover:bg-secondary/80">
                {typeof tag === 'string' ? tag.trim() : tag}
              </Badge>
            ))}
          {(Array.isArray(course.tags) ? course.tags : course.tags.split(",")).length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{(Array.isArray(course.tags) ? course.tags : course.tags.split(",")).length - 3} more
            </Badge>
          )}
        </div>

        {/* Course Stats */}
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.purchased}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.ratings.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{formatPrice(course.price)}</span>
          {course.estimatedPrice && course.estimatedPrice < course.price && <span className="text-sm text-muted-foreground line-through">{formatPrice(course.estimatedPrice)}</span>}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => onView?.(course._id)} className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-blue-500 lg:h-8 lg:w-8">
            <Eye className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onEdit?.(course._id)} className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-green-500 lg:h-8 lg:w-8">
            <Edit className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete?.(course._id)} className="group/btn h-7 w-7 cursor-pointer rounded-lg hover:bg-red-500 lg:h-8 lg:w-8">
            <Trash2 className="h-4 w-4 group-hover/btn:text-white" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
