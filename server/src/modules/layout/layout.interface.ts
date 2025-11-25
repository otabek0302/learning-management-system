import { Document, Schema } from "mongoose";

export interface IBanner {
  title: string;
  subTitle?: string;
  image?: {
    public_id: string;
    url: string;
  };
}

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface ILayout extends Document {
  type: "banner" | "faq" | "categories";
  banner?: IBanner;
  faq?: IFaqItem[];
  categories?: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateLayout {
  type: "banner" | "faq" | "categories";
  title?: string;
  subTitle?: string;
  image?: string;
  faq?: IFaqItem[];
  categories?: string[];
}

export interface IUpdateLayout {
  title?: string;
  subTitle?: string;
  image?: string;
  faq?: IFaqItem[];
  categories?: string[];
}

