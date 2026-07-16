// validators/password.schema.js
import { z } from "zod";

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(4),
  confirmPassword: z.string().min(4),
});
