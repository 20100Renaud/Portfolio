import prisma from "../prismaClient.js";


export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.T_Users.findUnique({ where: { ID_User: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }
    const unknown = await prisma.T_Users.findFirst({
      where: { Mail_User: process.env.UNKNOWN_EMAIL }
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }
    if (user.Role_User === "ADMIN") {
      return res.status(403).json({ error: "Cannot delete admin account" });
    }

    await prisma.T_Comments.updateMany({
      where: { ID_User_Com: req.user.userId },
      data: { ID_User_Com: unknown.ID_User }
    });

    await prisma.T_Comments.deleteMany({
      where: { ID_Depots_Com: depot.ID_Depot }
    });

    await prisma.T_Users.delete({ where: { ID_User: userId } });

    res.json({ message: "Account deleted, answers reassigned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
