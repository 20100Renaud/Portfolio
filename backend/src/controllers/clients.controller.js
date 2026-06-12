import prisma from "../prismaClient.js";


export const deleteClient = async (req, res) => {
  try {
    const clientId = req.user.clientId;

    const client = await prisma.T_Clients.findUnique({ where: { ID_Client: clientId } });
    if (!client) return res.status(404).json({ error: "Client not found" });

    if (!process.env.UNKNOWN_EMAIL) {
      return res.status(500).json({ error: "UNKNOWN_EMAIL missing" });
    }
    const unknown = await prisma.T_Clients.findFirst({
      where: { Mail_Client: process.env.UNKNOWN_EMAIL }
    });
    if (!unknown) {
      return res.status(500).json({ error: "Unknown user missing" });
    }
    if (client.Role_Client === "ADMIN") {
      return res.status(403).json({ error: "Cannot delete admin account" });
    }

    await prisma.T_Comments.updateMany({
      where: { ID_Client_Com: req.user.clientId },
      data: { ID_Client_Com: unknown.ID_Client }
    });

    await prisma.T_Comments.deleteMany({
      where: { ID_Ads_Com: ad.ID_Ad }
    });

    await prisma.T_Clients.delete({ where: { ID_Client: clientId } });

    res.json({ message: "Account deleted, answers reassigned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
