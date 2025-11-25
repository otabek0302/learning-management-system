import { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory {
  name?: string;
  description?: string;
}

