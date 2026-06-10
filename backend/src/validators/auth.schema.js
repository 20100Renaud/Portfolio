import { z } from "zod"


export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
  username: z.string().min(4),
  ville_client:z.string(),
  latitude_client:z.number(),
  longitude_client:z.number()
})
