import { z } from "zod";

export const requestSchema = z.object({
  body: z.any(),
  params: z.any(),
  query: z.any(),
});

export const requestUserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  role: z.string(),
});

export type RequestSchema = z.infer<typeof requestSchema>;
export type RequestUserSchema = z.infer<typeof requestUserSchema>;
