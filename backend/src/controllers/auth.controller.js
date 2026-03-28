import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prismaClient.js";
import { registerSchema } from "../validators/auth.schema.js"
import { hashEmail } from "../utils/hash.js";


export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const normalizedEmail = data.email.toLowerCase().trim();
    const emailHash = hashEmail(normalizedEmail);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.T_Clients.create({
      data: {
        Login_Client: data.username,
        Mail_Client: normalizedEmail,
        Mail_Hash_Client: emailHash,
        Password_Client: hashedPassword
      }
    });

    const token = jwt.sign(
      {
        clientId: user.ID_Client,
        username: user.Login_Client,
        role: user.Role_Client
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, username: user.Login_Client });

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
};

export const connect = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailHash = hashEmail(email);

    const user = await prisma.T_Clients.findUnique({
      where: { Mail_Hash_Client: emailHash }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.Password_Client);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        clientId: user.ID_Client,
        username: user.Login_Client,
        role: user.Role_Client
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        username: user.Login_Client
      });

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
