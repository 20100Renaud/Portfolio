import { Router } from "express"
import { register, connect } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", register)
router.post("/connect", connect)
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.get("/protected-data", authMiddleware, (req, res) => {
  res.json({ message: "This is protected", clientId: req.user.clientId });
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    clientId: req.user.clientId,
    username: req.user.username
  });
});

export default router
