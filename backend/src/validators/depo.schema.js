import { z } from "zod";

export const CreateDepoSchema = z.object({
    type: z.string(),
    cat: z.string(),
    title: z.string().min(4).max(25),
    description: z.string().min(4).max(255),
    lifetime: z.coerce.date(),
});

export const UpdateDepoSchema = z.object({
    type: z.string().optional(),
    cat: z.string().optional(),
    title: z.string().min(4).max(25).optional(),
    description: z.string().min(4).max(255).optional(),
    lifetime: z.coerce.date().optional(),
});
