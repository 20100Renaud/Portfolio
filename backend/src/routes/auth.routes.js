import { Router } from "express";
import { register, connect } from "../controllers/auth.controller.js";
import { deleteUser, updateUser } from "../controllers/users.controller.js";
import { changePassword } from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";
import { hmacEmail, encryptEmail, decryptEmail } from "../utils/emailCrypto.js";
import { registerLimiter, LoginLimiter, UpdateLimiter } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/connect", LoginLimiter, connect);
router.put("/update", UpdateLimiter, authMiddleware, updateUser);
router.put("/changePassword", changePassword)
router.delete("/delete", authMiddleware, deleteUser);
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
    hashed_email: user.Email_Hash_User,
    crypted_email: user.Email_Encrypted_User
  });
});

export default router;
