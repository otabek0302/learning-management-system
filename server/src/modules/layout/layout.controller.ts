import type { Request, Response } from "express";
import { AsyncFunction } from "../../middleware/async.middleware";
import { NotFoundError } from "../../shared/errors";
import { layoutService } from "./layout.service";

export const getLayoutByType = AsyncFunction(async (req: Request, res: Response) => {
  const { type } = req.params;

  const layout = await layoutService.findByType(type);

  if (!layout) {
    res.status(200).json({
      success: true,
      layout: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    layout,
  });
});

export const getLayoutById = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  const layout = await layoutService.findById(id);
  if (!layout) {
    throw new NotFoundError("Layout", id);
  }

  res.status(200).json({
    success: true,
    layout,
  });
});

export const getAllLayouts = AsyncFunction(async (req: Request, res: Response) => {
  const layouts = await layoutService.findAll();

  res.status(200).json({
    success: true,
    layouts,
  });
});

export const createLayout = AsyncFunction(async (req: Request, res: Response) => {
  const { type, title, subTitle, image, faq, categories } = req.body;

  const layout = await layoutService.create({
    type,
    title,
    subTitle,
    image,
    faq,
    categories,
  });

  res.status(201).json({
    success: true,
    message: "Layout created successfully",
    layout,
  });
});

export const updateLayout = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subTitle, image, faq, categories } = req.body;

  const layout = await layoutService.update(id, {
    title,
    subTitle,
    image,
    faq,
    categories,
  });

  res.status(200).json({
    success: true,
    message: "Layout updated successfully",
    layout,
  });
});

export const deleteLayout = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  await layoutService.delete(id);

  res.status(200).json({
    success: true,
    message: "Layout deleted successfully",
  });
});
