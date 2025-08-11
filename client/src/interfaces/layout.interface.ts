export interface IFaqItem {
    question: string;
    answer: string;
}

export interface Category {
    title: string;
}

export interface BannerImage {
    public_id: string;
    url: string;
}

export interface Layout {
    _id: string;
    type: string;
    faq: IFaqItem[];
    categories: Category[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    };
    createdAt: string;
    updatedAt: string;
}
