import type { Document, Types } from "mongoose";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface IThumbnail {
  public_id?: string;
  url?: string;
  secure_url?: string;
}

export interface IVideo {
  public_id: string;
  url: string;
  secure_url: string;
  duration?: number;
  format?: string;
}

export interface ILink {
  title?: string;
  url?: string;
}

export interface ICommentReply {
  [key: string]: unknown;
}

export interface IComment {
  user: Types.ObjectId;
  comment: string;
  commentReplies?: ICommentReply[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  user: Types.ObjectId;
  rating?: number;
  comment?: string;
  commentReplies?: ICommentReply[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz {
  questions: IQuizQuestion[];
  passingScore?: number;
}

export interface ICourseData {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  video: IVideo;
  videoSection: string;
  links?: ILink[];
  suggestion?: string;
  comments?: IComment[];
  order?: number;
  isPreview?: boolean;
  isLocked?: boolean;
  quiz?: IQuiz;
}

export interface ICourse extends Document {
  name: string;
  description: string;
  categoryId: Types.ObjectId;
  price: number;
  estimatedPrice: number;
  thumbnail?: IThumbnail;
  tags?: string[];
  benefits?: string[];
  prerequisites?: string[];
  level: CourseLevel;
  reviews: IReview[];
  courseData: ICourseData[];
  totalLessons: number;
  totalDuration: number;
  ratings: number;
  purchased: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseData extends Omit<ICourseData, "_id" | "video"> {
  videoUrl?: string;
  video?: IVideo;
}

export interface ICreateCourse {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  estimatedPrice: number;
  thumbnail: string | IThumbnail;
  tags?: string[] | string;
  benefits?: string[];
  prerequisites?: string[];
  level: CourseLevel;
  courseData: ICreateCourseData[];
}

export type IUpdateCourse = Partial<Omit<ICreateCourse, "thumbnail" | "courseData">> & {
  thumbnail?: string | IThumbnail;
  courseData?: ICreateCourseData[];
};

export interface ICourseQuery {
  category?: string;
  page?: number;
  limit?: number;
}

