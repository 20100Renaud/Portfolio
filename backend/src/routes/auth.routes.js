import { Router } from "express";
import { register, connect } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";


const router = Router();

router.post("/register", register);
router.post("/connect", connect);
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.T_Users.findUnique({
    where: {
      ID_User: req.user.userId,
    },
  });

  res.json({
    userId: user.ID_User,
    username: user.Login_User,
    role: user.Role_User,
    Latitude_User: user.Latitude_User,
    Longitude_User: user.Longitude_User,
    City_User: user.City_User,
    email: user.Email_User,
  });
});

export default router;
