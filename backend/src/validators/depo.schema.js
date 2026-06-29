import { z } from "zod";

export const CreateDepoSchema = z.object({
    type: z.string(),
    cat: z.string(),
    title: z.string().min(4).max(25),
    description: z.string().min(4).max(255),
    lifetime: z.date(),
});

export const UpdateDepoSchema = z.object({
    type: z.string(),
    cat: z.string(),
    title: z.string().min(4).max(25),
    description: z.string().min(4).max(255),
    lifetime: z.date(),
});
