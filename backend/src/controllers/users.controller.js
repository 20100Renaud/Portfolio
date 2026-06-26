import { email } from "zod";
import prisma from "../prismaClient.js";
import { UpdateSchema } from "../validators/auth.schema.js";

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
    const unknown = await prisma.T_Users.findFirst({
      where: { Email_User: process.env.UNKNOWN_EMAIL },
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

    await prisma.T_Users.delete({ where: { ID_User: userId } });

    res.json({ message: "Account deleted, answers reassigned" });
    res.status(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try{
    console.log("BODY: ", req.body);
    const datat = UpdateSchema.parse(req.body);
    const normalizedEmail = datat.email.toLowerCase().trim();

    const existingUser = await prisma.T_Users.findUnique({
      where: { Email_User: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }
    const user = req.user;
    if (!user) return res.status(404).json({ error: "User not found"});

    const data = {};

    if (req.body.username) {
      data.Login_User = req.body.username;
    }

    if (req.body.email) {
      data.Email_User = req.body.email;
    }

    console.log("req.user =", req.user);
    const updated = await prisma.t_Users.update({
      where: { ID_User: user.userId },
      data,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};
