import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(4).max(20),
  email: z.email(),
  password: z.string().min(4),
  city_user: z.string(),
  latitude_user: z.number(),
  longitude_user: z.number(),
});

export const UpdateSchema = z.object({
    username: z.string().min(4).max(20),
    email: z.email(),
});
