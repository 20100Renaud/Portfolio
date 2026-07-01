import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { registerSchema } from "../validators/auth.schema.js";

export const register = async (req, res) => {
  try { 
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }
    const data = result.data;
    const normalizedEmail = data.email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const existingUser = await prisma.T_Users.findUnique({
      where: { Email_User: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }

    const user = await prisma.T_Users.create({
      data: {
        Login_User: data.username,
        Email_User: normalizedEmail,
        Password_User: hashedPassword,
        City_User: data.city_user,
        Latitude_User: data.latitude_user,
        Longitude_User: data.longitude_user,
      },
    });

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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const connect = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.T_Users.findUnique({
      where: { Email_User: normalizedEmail },
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
