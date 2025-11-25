import type { ICourse, ICreateCourse, IUpdateCourse, ICourseQuery } from "./course.interface";
import CourseModel from "./course.model";
import CategoryModel from "../category/category.model";
import mongoose from "mongoose";

import { ValidationError } from "../../shared/errors/validation.error";
import { ConflictError } from "../../shared/errors/conflict.error";
import { NotFoundError } from "../../shared/errors/not-found.error";
import { uploadImage, uploadVideo, deleteFile, deleteFiles } from "../../services/cloudinary.service";

export class CourseService {
  private static instance: CourseService;

  private constructor() {}

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  async findById(id: string): Promise<ICourse | null> {
    if (!id) {
      throw new ValidationError("Course ID is required");
    }
    return await CourseModel.findById(id).populate("categoryId").populate("courseData.comments.user").populate("reviews.user");
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 12,
    filters: ICourseQuery = {}
  ): Promise<{
    courses: ICourse[];
    totalCourses: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.category) {
      query.categoryId = filters.category;
    }

    const totalCourses = await CourseModel.countDocuments(query);
    const courses = await CourseModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId")
      .lean();

    return {
      courses: courses as ICourse[],
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      hasMore: totalCourses > skip + courses.length,
    };
  }

  async create(data: ICreateCourse): Promise<ICourse> {
    if (!data.name?.trim()) {
      throw new ValidationError("Course name is required");
    }

    // Check for duplicate course name
    const existingCourse = await CourseModel.findOne({ name: data.name.trim() });
    if (existingCourse) {
      throw new ConflictError("Course with this name already exists", { name: data.name });
    }

    // Validate category exists
    if (!data.categoryId) {
      throw new ValidationError("Category ID is required");
    }
    const category = await CategoryModel.findById(data.categoryId);
    if (!category) {
      throw new NotFoundError("Category", data.categoryId);
    }

    // Upload thumbnail if provided as base64
    let thumbnailData: any = undefined;
    if (data.thumbnail) {
      if (typeof data.thumbnail === "string" && data.thumbnail.startsWith("data:")) {
        const uploadResponse = await uploadImage(data.thumbnail, {
          folder: "courses/thumbnails",
          width: 800,
          height: 450,
          crop: "fill",
        });
        thumbnailData = {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
          secure_url: uploadResponse.secure_url,
        };
      } else if (typeof data.thumbnail === "object") {
        thumbnailData = data.thumbnail;
      }
    }

    // Process course data - upload videos if needed
    const processedCourseData: any[] = [];
    for (const lesson of data.courseData) {
      let videoData: any = undefined;

      if (lesson.video) {
        videoData = lesson.video;
      } else if (lesson.videoUrl && lesson.videoUrl.startsWith("data:")) {
        const uploadResponse = await uploadVideo(lesson.videoUrl, {
          folder: "courses/videos",
        });
        videoData = {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
          secure_url: uploadResponse.secure_url,
          duration: uploadResponse.duration,
          format: uploadResponse.format,
        };
      } else {
        throw new ValidationError("Each lesson must have a video");
      }

      processedCourseData.push({
        title: lesson.title,
        description: lesson.description,
        video: videoData,
        videoSection: lesson.videoSection || "Untitled Section",
        links: lesson.links || [],
        suggestion: lesson.suggestion,
        order: lesson.order ?? 0,
        isPreview: lesson.isPreview ?? false,
        isLocked: lesson.isLocked ?? true,
        quiz: lesson.quiz,
      });
    }

    // Format tags
    const tagsArray = Array.isArray(data.tags) ? data.tags : typeof data.tags === "string" ? data.tags.split(",").map((t) => t.trim()) : [];

    const course = await CourseModel.create({
      name: data.name.trim(),
      description: data.description.trim(),
      categoryId: category._id,
      price: data.price,
      estimatedPrice: data.estimatedPrice,
      thumbnail: thumbnailData,
      tags: tagsArray,
      benefits: data.benefits || [],
      prerequisites: data.prerequisites || [],
      level: data.level,
      courseData: processedCourseData,
    });

    return course;
  }

  async update(id: string, data: IUpdateCourse): Promise<ICourse> {
    if (!id) {
      throw new ValidationError("Course ID is required");
    }

    const course = await this.findById(id);
    if (!course) {
      throw new NotFoundError("Course", id);
    }

    // Update basic fields
    if (data.name !== undefined && data.name.trim() !== course.name) {
      const existingCourse = await CourseModel.findOne({ name: data.name.trim() });
      if (existingCourse && String(existingCourse._id) !== id) {
        throw new ConflictError("Course with this name already exists", { name: data.name });
      }
      course.name = data.name.trim();
    }
    if (data.description !== undefined) course.description = data.description.trim();
    if (data.price !== undefined) course.price = data.price;
    if (data.estimatedPrice !== undefined) course.estimatedPrice = data.estimatedPrice;
    if (data.level !== undefined) course.level = data.level;

    // Update category if provided
    if (data.categoryId !== undefined) {
      const category = await CategoryModel.findById(data.categoryId);
      if (!category) {
        throw new NotFoundError("Category", data.categoryId);
      }
      course.categoryId = category._id as mongoose.Types.ObjectId;
    }

    // Update thumbnail if provided
    if (data.thumbnail !== undefined) {
      if (typeof data.thumbnail === "string" && data.thumbnail.startsWith("data:")) {
        // Delete old thumbnail
        if (course.thumbnail?.public_id) {
          await deleteFile(course.thumbnail.public_id, "image");
        }

        // Upload new thumbnail
        const uploadResponse = await uploadImage(data.thumbnail, {
          folder: "courses/thumbnails",
          width: 800,
          height: 450,
          crop: "fill",
        });
        course.thumbnail = {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
          secure_url: uploadResponse.secure_url,
        };
      } else if (typeof data.thumbnail === "object") {
        course.thumbnail = data.thumbnail;
      }
    }

    // Update tags
    if (data.tags !== undefined) {
      const tagsArray = Array.isArray(data.tags) ? data.tags : typeof data.tags === "string" ? data.tags.split(",").map((t) => t.trim()) : [];
      course.tags = tagsArray;
    }

    // Update benefits and prerequisites
    if (data.benefits !== undefined) course.benefits = data.benefits;
    if (data.prerequisites !== undefined) course.prerequisites = data.prerequisites;

    // Update course data if provided
    if (data.courseData !== undefined) {
      // Collect old video public_ids for cleanup
      const oldVideoPublicIds: string[] = [];
      course.courseData.forEach((lesson: any) => {
        if (lesson.video?.public_id) {
          oldVideoPublicIds.push(lesson.video.public_id);
        }
      });

      const processedCourseData: any[] = [];
      for (const lesson of data.courseData) {
        let videoData: any = undefined;

        if (lesson.video && lesson.video.public_id) {
          // Existing video object (keep it)
          videoData = lesson.video;
        } else if (lesson.videoUrl && lesson.videoUrl.startsWith("data:")) {
          // New video upload
          const uploadResponse = await uploadVideo(lesson.videoUrl, {
            folder: "courses/videos",
          });
          videoData = {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url,
            secure_url: uploadResponse.secure_url,
            duration: uploadResponse.duration,
            format: uploadResponse.format,
          };
        } else {
          // Try to find existing video in course by title
          const existingLesson = course.courseData.find((l: any) => l.title === lesson.title);
          if (existingLesson?.video) {
            videoData = existingLesson.video;
          } else {
            throw new ValidationError("Each lesson must have a video");
          }
        }

        processedCourseData.push({
          title: lesson.title,
          description: lesson.description,
          video: videoData,
          videoSection: lesson.videoSection || "Untitled Section",
          links: lesson.links || [],
          suggestion: lesson.suggestion,
          order: lesson.order ?? 0,
          isPreview: lesson.isPreview ?? false,
          isLocked: lesson.isLocked ?? true,
          quiz: lesson.quiz,
        });
      }
      course.courseData = processedCourseData as any;

      // Delete old videos that are no longer in the courseData
      const newVideoPublicIds = processedCourseData.map((lesson) => lesson.video?.public_id).filter(Boolean) as string[];
      const videosToDelete = oldVideoPublicIds.filter((id) => !newVideoPublicIds.includes(id));
      if (videosToDelete.length > 0) {
        await deleteFiles(videosToDelete, "video");
      }
    }

    await course.save();
    const updatedCourse = await this.findById(id);
    if (!updatedCourse) {
      throw new NotFoundError("Course", id);
    }
    return updatedCourse;
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError("Course ID is required");
    }

    const course = await this.findById(id);
    if (!course) {
      throw new NotFoundError("Course", id);
    }

    // Delete thumbnail from Cloudinary
    if (course.thumbnail?.public_id) {
      await deleteFile(course.thumbnail.public_id, "image");
    }

    // Delete videos from Cloudinary
    if (course.courseData && course.courseData.length > 0) {
      const videoPublicIds = course.courseData
        .map((lesson: any) => lesson.video?.public_id)
        .filter((id: string | undefined) => id) as string[];
      if (videoPublicIds.length > 0) {
        await deleteFiles(videoPublicIds, "video");
      }
    }

    await course.deleteOne();
  }
}

export const courseService = CourseService.getInstance();

