import prisma from "../prismaClient.js";
import { UpdateSchema } from "../validators/auth.schema.js";
import bcrypt from "bcrypt";
import { normalizeUsername } from "../utils/username.js";
import { hmacEmail, encryptEmail } from "../utils/emailCrypto.js";
import jwt from "jsonwebtoken";
import { ChangePasswordSchema } from "../validators/password.schema.js";

export const deleteUser = async (req, res) => {
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
    const unknowEmailHash = hmacEmail(unknownEmail);

    const unknown = await prisma.T_Users.findFirst({
      where: { Email_Hash_User: unknowEmailHash },
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
    const validatedData = result.data;

    const data = {};

    if (validatedData.username) {
      const normalizedUsername = normalizeUsername(validatedData.username);

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

    if (validatedData.email) {
      const normalizedEmail = validatedData.email.toLowerCase().trim();

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

    if (validatedData.city_user) {
      data.City_User = validatedData.city_user;
    }

    if (validatedData.latitude_user !== undefined) {
      data.Latitude_User = validatedData.latitude_user;
    }

    if (validatedData.longitude_user !== undefined) {
      data.Longitude_User = validatedData.longitude_user;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: "Nothing to update",
      });
    }

    const updated = await prisma.T_Users.update({
      where: { ID_User: user.userId },
      data,
    });

    const token = jwt.sign(
      {
        userId: updated.ID_User,
        username: updated.Login_User,
        role: updated.Role_User,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Change it for true in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const result = ChangePasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { oldPassword, newPassword, confirmPassword } = result.data;

    const userId = req.user.userId;

    const user = await prisma.t_Users.findUnique({
      where: {
        ID_User: userId,
      },
      select: {
        Password_User: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isValid = await bcrypt.compare(oldPassword, user.Password_User);

    if (!isValid) {
      return res.status(400).json({
        message: "Old password is incorrect",
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
    res.status(500).json({
      error: err.message,
    });
  }
};
