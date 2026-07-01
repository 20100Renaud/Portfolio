import { z } from "zod";

export const CreateAnswersSchema = z.object({
    description: z.string().min(4).max(255),
});

export const UpdateAnswersSchema = z.object({
    description: z.string().min(4).max(255).optional(),
});
