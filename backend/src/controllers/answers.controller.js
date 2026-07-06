import prisma from "../prismaClient.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import { error } from "node:console";
import { CreateAnswersSchema, UpdateAnswersSchema } from "../validators/answers.schema.js";
import { sendAnswerReceivedEmail} from "../services/email.service.js";

export const createAnswer = async (req, res) => {
  try {
    const result = CreateAnswersSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const data = result.data;

    const depo = req.depo;
    if (!depo) return res.status(404).json({ error: "Depo not found" });

    const answer = await prisma.T_Answers.create({
      data: {
        Text_Answer: data.description,
        ID_Depo: depo.ID_Depo,
        ID_User: req.user.userId,
      },
    });

    const owner = await prisma.T_Users.findUnique({
      where: {
        ID_User: depo.ID_User,
      },
      select: {
        Email_User: true,
        Login_User: true,
      },
    });

    const sender = await prisma.t_Users.findUnique({
      where: {
        ID_User: answer.ID_User,
      },
      select: {
        Login_User: true,
      }
    })

    await sendAnswerReceivedEmail(owner.Email_User, sender, depo, answer);
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const answer = req.answer;
    if (!answer) return res.status(404).json({ error: "answer not found" });

    if (req.user.userId !== answer.ID_User && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const result = UpdateAnswersSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    }

    const data = result.data;

    const updated = await prisma.T_Answers.update({
      where: {
        ID_Answer: req.params.id,
      },
      data: {
        Text_Answer: data.description,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const answer = req.answer;
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    if (req.user.userId !== answer.ID_User && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await prisma.T_Answers.delete({ where: { ID_Answer: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};