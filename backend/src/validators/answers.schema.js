import { z } from "zod";

export const CreateAnswersSchema = z.object({
    type: z.string(),
    cat: z.string(),
    title: z.string().min(4).max(25),
    description: z.string().min(4).max(255),
    lifetime: z.date(),
});

export const UpdateAnswersSchema = z.object({
    type: z.string(),
    cat: z.string(),
    title: z.string().min(4).max(25),
    description: z.string().min(4).max(255),
    lifetime: z.date(),
});
