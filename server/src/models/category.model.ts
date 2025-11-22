import { Model, Schema, model } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

const CategoryModel: Model<ICategory> = model("Category", categorySchema);

export default CategoryModel;

