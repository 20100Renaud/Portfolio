import prisma from "../prismaClient.js";

export const preloadDepo = async (req, res, next) => {

  try {
    const depo = await prisma.T_Depos.findUnique({
      where: { ID_Depo: req.params.id },
      include: {
        User_Depos: true,
        Answers_Depos: {
          include: { User_Answers: true },
        },
      },
    });

    
    if (!depo) {
      return res.status(404).json({ error: "Depo not found" });
    }

    req.depo = depo;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
