import { email } from "zod";
import prisma from "../prismaClient.js";
import { UpdateSchema } from "../validators/auth.schema.js";
import { log } from "node:console";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { normalizeUsername } from "../utils/username.js";
import { hmacEmail, encryptEmail, decryptEmail } from "../utils/emailCrypto.js";

export const deleteUser = async (req, res) => {
  console.log("DELETE USER CONTROLLER");
  
  try {
        const userId = req.user.userId;

    const user = await prisma.T_Users.findUnique({
      where: { ID_User: userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }

    const unknownEmail = process.env.UNKNOWN_EMAIL;
    if (!unknownEmail) {
      throw new Error("UNKNOWN_EMAIL missing");
    }
    const UnknowEmailHash = hmacEmail(unknownEmail);

    const unknown = await prisma.T_Users.findFirst({
      where: { Email_Hash_User: UnknowEmailHash },
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }
    if (user.Role_User === "ADMIN") {
      return res.status(403).json({ error: "Cannot delete admin account" });
    }
    await prisma.T_Answers.updateMany({
      where: { ID_User: req.user.userId },
      data: { ID_User: unknown.ID_User },
    });
    await prisma.t_Depos.deleteMany({
      where: { ID_User: req.user.userId },
    });

    await prisma.T_Users.delete({ where: { ID_User: userId } });

    return res.status(200).json({
      message: "Account deleted, answers reassigned",
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const normalizedUsername = normalizeUsername(data.username);
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = UpdateSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }
    const datat = result.data;

    const data = {};

    if (req.body.username) {
      const normalizedUsername = datat.username
        .trim()
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

      const existingUsername = await prisma.T_Users.findFirst({
        where: {
          Login_User: normalizedUsername,
          NOT: {
            ID_User: user.userId,
          },
        },
      });

      if (existingUsername) {
        return res.status(409).json({
          error: "Username already exists",
        });
      }

      data.Login_User = normalizedUsername;
    }

    if (req.body.email) {
      const normalizedEmail = datat.email.toLowerCase().trim();

      const emailHash = hmacEmail(normalizedEmail);

      const existingUser = await prisma.T_Users.findUnique({
        where: {
          Email_Hash_User: emailHash,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          error: "Email already used",
        });
      }

      data.Email_Hash_User = emailHash;
      data.Email_Encrypted_User = encryptEmail(normalizedEmail);
    }

    if (req.body.city_user) {
      data.City_User = datat.city_user;
    }

    if (req.body.latitude_user) {
      data.Latitude_User = datat.latitude_user;
    }

    if (req.body.longitude_user) {
      data.Longitude_User = datat.longitude_user;
    }

    const updated = await prisma.T_Users.update({
      where: { ID_User: user.userId },
      data,
    });
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const userId = req.user.userId;

    const user = await prisma.t_Users.findUnique({
      where: {
        ID_User: userId,
      },
      select: {
        Password_User: true,
      },
    });

    const oldPasswordHash = user.Password_User;

    const isValid = await bcrypt.compare(req.body.oldPassword, oldPasswordHash);

    if (!isValid) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({
        message: "New Password must be at least 4 char",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password doesn't match",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.t_Users.update({
      where: {
        ID_User: userId,
      },
      data: {
        Password_User: newHash,
      },
    });

    return res.status(200).json({
      message: "Password modified",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
