import rateLimit from "express-rate-limit";
import prisma from "../prismaClient.js";

export const preloadDepo = async (req, res, next) => {

  try {
    const depo = await prisma.T_Depos.findUnique({
      where: { ID_Depo: req.params.id },
      include: {
        User_Depos: true,
        Images_Depos: true,
        Answers_Depos: {
          include: {
            User_Answers: true,
          },
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

// Function used at the creation of a depo or an answer
export const CreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many request ! Try later.",
  },
})

// Function used at the updatye of a depo
export const UpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many request ! Try later.",
  },
})