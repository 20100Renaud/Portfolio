import { Router } from "express";
import { register, connect } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/connect", connect);
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.get("/protected-data", authMiddleware, (req, res) => {
  res.json({ message: "This is protected", userId: req.user.userId });
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    userId: req.user.userId,
    username: req.user.username,
    role: req.user.role,
  });
});

export default router;
