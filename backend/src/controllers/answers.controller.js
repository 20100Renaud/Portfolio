import prisma from "../prismaClient.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import { error } from "node:console";
import { CreateAnswersSchema, UpdateAnswersSchema } from "../validators/answers.schema.js";

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
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAnswer = async (req, res) => {
  try {
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

    await prisma.T_Answers.delete({ where: { ID_Answer: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};