import { Schema, model } from "mongoose";
import { BannerImage, Category, IFaqItem, Layout } from "../interfaces/layout.interface";


const faqSchema = new Schema<IFaqItem>({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
}, { timestamps: true });


const categorySchema = new Schema<Category>({
    title: {
        type: String,
        required: true,
    },
}, { timestamps: true });


const bannerImageSchema = new Schema<BannerImage>({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, { timestamps: true });


const layoutSchema = new Schema<Layout>({
    type: {
        type: String,
        required: true,
    },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
        image: bannerImageSchema,
        title: {
            type: String,
        },
        subTitle: {
            type: String,
        },
    },
}, { timestamps: true });


const LayoutModel = model<Layout>("Layout", layoutSchema);

export default LayoutModel;