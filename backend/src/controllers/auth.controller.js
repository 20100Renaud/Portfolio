import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prismaClient.js";
import { registerSchema } from "../validators/auth.schema.js"


export const register = async (req, res) => {
  try {
    console.log("req: ", req.body);
    const data = registerSchema.parse(req.body)
    console.log("data: ", data);
    const normalizedEmail = data.email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const existingUser = await prisma.T_Clients.findUnique({
      where: { Mail_Client: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }

    const user = await prisma.T_Clients.create({
      data: {
        Login_Client: data.username,
        Mail_Client: normalizedEmail,
        Password_Client: hashedPassword,
        Ville_Client: data.ville_client,
        Latitude_Client: data.latitude_client,
        Longitude_Client: data.longitude_client
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

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        username: user.Login_Client
      });

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
};

export const connect = async (req, res) => {
  try {
    console.log("req.body: ", req.body);
		console.log("\n[AUTH] --- LOGIN REQUEST START ---");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    console.log("[AUTH] searching user...");
    const user = await prisma.T_Clients.findUnique({
      where: { Mail_Client: normalizedEmail }
    });

    if (!user) {
			console.log("[AUTH] user not found");
      return res.status(401).json({ error: "Invalid credentials" });
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
      .status(200)
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
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
