import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashEmail } from "../utils/hash.js";

export const createFirstAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const emailHash = hashEmail(normalizedEmail);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.T_Clients.create({
      data: {
        Login_Client: username,
        Mail_Client: normalizedEmail,
        Mail_Hash_Client: emailHash,
        Password_Client: hashedPassword,
        Role_Client: "ADMIN",
      },
    });

    const token = jwt.sign(
      {
        clientId: admin.ID_Client,
        username: admin.Login_Client,
        role: admin.Role_Client,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "First admin created",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
