export const deleteClient = async (req, res) => {
  try {
    const clientId = req.user.clientId;

    const client = await prisma.T_Clients.findUnique({ where: { ID_Client: clientId } });
    if (!client) return res.status(404).json({ error: "Client not found" });

    await prisma.T_Comments.updateMany({
      where: { ID_Client_Com: req.user.clientId },
      data: { ID_Client_Com: "UNKNOWN_CLIENT_ID" }
    });

    await prisma.T_Clients.delete({ where: { ID_Client: clientId } });

    res.json({ message: "Client deleted, comments reassigned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
