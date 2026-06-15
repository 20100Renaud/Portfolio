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

    const existingUser = await prisma.T_Users.findUnique({
      where: { Mail_User: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }

    const user = await prisma.T_Users.create({
      data: {
        Login_User: data.username,
        Mail_User: normalizedEmail,
        Password_User: hashedPassword,
        City_User: data.city_user,
        Latitude_User: data.latitude_user,
        Longitude_User: data.longitude_user
      }
    });

    const token = jwt.sign(
      {
        userId: user.ID_User,
        username: user.Login_User,
        role: user.Role_User
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
        username: user.Login_User
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
    const user = await prisma.T_Users.findUnique({
      where: { Mail_User: normalizedEmail }
    });

    if (!user) {
			console.log("[AUTH] user not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

		console.log("[AUTH] comparing password...");
		    const valid = await bcrypt.compare(password, user.Password_User);

		console.log("[AUTH] password valid:", valid);

    if (!valid) {
			console.log("[AUTH] wrong password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

		console.log("[AUTH] generating JWT...");
    const token = jwt.sign(
      {
        userId: user.ID_User,
        username: user.Login_User,
        role: user.Role_User
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
        username: user.Login_User
      });

		console.log("[AUTH] --- LOGIN COMPLETE ---");


  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
