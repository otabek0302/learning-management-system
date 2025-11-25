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

export interface ILayout {
  _id: string;
  type: "banner" | "faq" | "categories";
  banner?: IBanner;
  faq?: IFaqItem[];
  categories?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
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

export interface Layout {
  _id: string;
  type: string;
  banner?: IBanner;
  faq?: IFaqItem[];
  categories?: string[];
}

