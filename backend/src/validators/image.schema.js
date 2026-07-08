import { z } from "zod";

export const UpdateImageSchema = z.object({
  title: z.string().trim().max(100).nullable().optional(),
});
