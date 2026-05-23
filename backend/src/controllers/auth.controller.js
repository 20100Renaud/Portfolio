import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prismaClient.js";
import { registerSchema } from "../validators/auth.schema.js"


export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const normalizedEmail = data.email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.T_Clients.create({
      data: {
        Login_Client: data.username,
        Mail_Client: normalizedEmail,
        Password_Client: hashedPassword,
        PC_Client: data.pc_client
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
		console.log("\n[AUTH] --- LOGIN REQUEST START ---");
    console.log("[AUTH] body:", req.body);

    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
		console.log("[AUTH] normalizedEmail:", normalizedEmail);

    console.log("[AUTH] searching user...");
    const user = await prisma.T_Clients.findUnique({
      where: { Mail_Client: normalizedEmail }
    });

		console.log("[AUTH] user found:", !!user);

    if (!user) {
			console.log("[AUTH] user not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

		console.log("[AUTH] checking disabled status...");
    if (user.Password_Client === "DISABLED") {
			console.log("[AUTH] account disabled");
      return res.status(403).json({ error: "Account disabled" });
    }

		console.log("[AUTH] comparing password...");
		    const valid = await bcrypt.compare(password, user.Password_Client);

		console.log("[AUTH] password valid:", valid);

    if (!valid) {
			console.log("[AUTH] wrong password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

		console.log("[AUTH] generating JWT...");
    const token = jwt.sign(
      {
        clientId: user.ID_Client,
        username: user.Login_Client,
        role: user.Role_Client
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

		console.log("[AUTH] sending response");

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        username: user.Login_Client
      });

		console.log("[AUTH] --- LOGIN COMPLETE ---");

  } catch (err) {
		console.log("[AUTH] ERROR:", err);
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
