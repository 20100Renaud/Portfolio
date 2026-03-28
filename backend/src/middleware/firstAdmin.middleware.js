import prisma from "../prismaClient.js";

export const firstAdminOnly = async (req, res, next) => {
  try {
    const adminExists = await prisma.T_Clients.findFirst({
      where: { Role_Client: "ADMIN" }
    });

    if (adminExists) {
      return res.status(403).json({ error: "Not allowed the create Admin account" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
