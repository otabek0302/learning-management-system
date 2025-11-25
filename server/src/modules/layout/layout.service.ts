import type { ILayout, ICreateLayout, IUpdateLayout } from "./layout.interface";
import LayoutModel from "./layout.model";
import CategoryModel from "../category/category.model";
import { ValidationError } from "../../shared/errors/validation.error";
import { ConflictError } from "../../shared/errors/conflict.error";
import { NotFoundError } from "../../shared/errors/not-found.error";
import { uploadImage, deleteFile } from "../../services/cloudinary.service";

export class LayoutService {
  private static instance: LayoutService;

  private constructor() {}

  public static getInstance(): LayoutService {
    if (!LayoutService.instance) {
      LayoutService.instance = new LayoutService();
    }
    return LayoutService.instance;
  }

  async findByType(type: string): Promise<ILayout | null> {
    if (!type) {
      throw new ValidationError("Layout type is required");
    }
    return await LayoutModel.findOne({ type }).populate("categories");
  }

  async findById(id: string): Promise<ILayout | null> {
    if (!id) {
      throw new ValidationError("Layout ID is required");
    }
    return await LayoutModel.findById(id).populate("categories");
  }

  async findAll(): Promise<ILayout[]> {
    return await LayoutModel.find().populate("categories").sort({ createdAt: -1 });
  }

  async create(data: ICreateLayout): Promise<ILayout> {
    if (!data.type) {
      throw new ValidationError("Layout type is required");
    }

    const existingLayout = await this.findByType(data.type);
    if (existingLayout) {
      throw new ConflictError(`Layout with type '${data.type}' already exists`, { type: data.type });
    }

    const layoutData: any = { type: data.type };

    if (data.type === "banner") {
      layoutData.banner = {
        title: data.title || "",
        subTitle: data.subTitle,
      };

      if (data.image) {
        const uploadResponse = await uploadImage(data.image, {
          folder: "layouts/banner",
          width: 1920,
          height: 1080,
          crop: "fill",
        });
        layoutData.banner.image = {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
        };
      }
    }

    if (data.type === "faq" && data.faq) {
      layoutData.faq = data.faq;
    }

    if (data.type === "categories" && data.categories && data.categories.length > 0) {
      const validCategories = await CategoryModel.find({
        _id: { $in: data.categories },
      });

      if (validCategories.length !== data.categories.length) {
        throw new ValidationError("Some category IDs are invalid");
      }

      layoutData.categories = data.categories;
    }

    return await LayoutModel.create(layoutData);
  }

  async update(id: string, data: IUpdateLayout): Promise<ILayout> {
    if (!id) {
      throw new ValidationError("Layout ID is required");
    }

    const layout = await this.findById(id);
    if (!layout) {
      throw new NotFoundError("Layout", id);
    }

    if (layout.type === "banner") {
      if (!layout.banner) {
        layout.banner = { title: "" };
      }

      if (data.title !== undefined) layout.banner.title = data.title;
      if (data.subTitle !== undefined) layout.banner.subTitle = data.subTitle;

      if (data.image) {
        if (layout.banner.image?.public_id) {
          await deleteFile(layout.banner.image.public_id, "image");
        }

        const uploadResponse = await uploadImage(data.image, {
          folder: "layouts/banner",
          width: 1920,
          height: 1080,
          crop: "fill",
        });

        layout.banner.image = {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
        };
      }
    }

    if (layout.type === "faq" && data.faq !== undefined) {
      layout.faq = data.faq;
    }

    if (layout.type === "categories" && data.categories !== undefined) {
      if (data.categories.length > 0) {
        const validCategories = await CategoryModel.find({
          _id: { $in: data.categories },
        });

        if (validCategories.length !== data.categories.length) {
          throw new ValidationError("Some category IDs are invalid");
        }
      }

      layout.categories = data.categories as any;
    }

    await layout.save();
    const updatedLayout = await this.findById(id);
    if (!updatedLayout) {
      throw new NotFoundError("Layout", id);
    }
    return updatedLayout;
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError("Layout ID is required");
    }

    const layout = await this.findById(id);
    if (!layout) {
      throw new NotFoundError("Layout", id);
    }

    if (layout.banner?.image?.public_id) {
      await deleteFile(layout.banner.image.public_id, "image");
    }

    await layout.deleteOne();
  }
}

export const layoutService = LayoutService.getInstance();

