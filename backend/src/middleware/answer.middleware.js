import rateLimit from "express-rate-limit";

// Function used at the update of an answer
export const UpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many request ! Try later.",
  },
})