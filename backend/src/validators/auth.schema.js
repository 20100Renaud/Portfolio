import { z } from "zod"


export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
  username: z.string().min(4),
  pc_client: z.string().regex(/^\d{5}$/, "PC_Client must be exactly 5 digits")
})
