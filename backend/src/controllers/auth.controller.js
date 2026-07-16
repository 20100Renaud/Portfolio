import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { Prisma } from "@prisma/client";
import { registerSchema } from "../validators/auth.schema.js";
import { normalizeUsername } from "../utils/username.js";
import { hmacEmail, encryptEmail, decryptEmail } from "../utils/emailCrypto.js";

export const register = async (req, res) => {
  try {
    // Initialize data
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }
    const data = result.data;
    const normalizedEmail = data.email.toLowerCase().trim();
    const emailHash = hmacEmail(normalizedEmail);
    const emailEncrypted = encryptEmail(normalizedEmail);
    const normalizedUsername = normalizeUsername(data.username);

    // Check if email is already in the db
    const existingUser = await prisma.T_Users.findUnique({
      where: { Email_Hash_User: emailHash },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }

    // Check if username is already in the db
    const existingUsername = await prisma.T_Users.findUnique({
      where: {
        Login_User: normalizedUsername,
      },
    });

    if (existingUsername) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    // Create the user
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.T_Users.create({
      data: {
        Login_User: normalizedUsername,
        Email_Hash_User: emailHash,
        Email_Encrypted_User: emailEncrypted,
        Password_User: hashedPassword,
        City_User: data.city_user,
        Latitude_User: data.latitude_user,
        Longitude_User: data.longitude_user,
      },
    });

    // Store date in token
    const token = jwt.sign(
      {
        userId: user.ID_User,
        username: user.Login_User,
        role: user.Role_User,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        username: user.Login_User,
      });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const field = err.meta?.target?.[0];

      if (field === "Login_User") {
        return res.status(409).json({
          field: "username",
          error: "Username already exists",
        });
      }

      if (field === "Email_Hash_User") {
        return res.status(409).json({
          field: "email",
          error: "Email already used",
        });
      }
    }

    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const connect = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailHash = hmacEmail(normalizedEmail);

    const user = await prisma.T_Users.findUnique({
      where: {
        Email_Hash_User: emailHash,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.Password_User);


    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.ID_User,
        username: user.Login_User,
        role: user.Role_User,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        username: user.Login_User,
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
