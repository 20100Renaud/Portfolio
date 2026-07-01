
import express from "express";
import {
  authMiddleware,
  isOwnerOrAdmin,
} from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import prisma from "../prismaClient.js";import {
    createAnswer,
    updateAnswer,
    deleteAnswer,
} from "../controllers/answers.controller.js";

const router = express.Router();


const preloadAnswer = async (req, res, next) => {
  console.log("id reçu :", req.params.id);

  const answer = await prisma.T_Answers.findUnique({
    where: {
      ID_Answer: req.params.id,
    },
  });

  console.log(answer);

  if (!answer) {
    return res.status(404).json({ error: "Answer not found" });
  }

  req.answer = answer;
  next();
};

router.put(
  "/answers/:id",
  authMiddleware,
  preloadAnswer,
  isOwnerOrAdmin((req) => req.answer.ID_User),
  updateAnswer,
);
router.delete(
  "/answers/:id",
  authMiddleware,
  preloadAnswer,
  isOwnerOrAdmin((req) => req.answer.ID_User),
  deleteAnswer,
);

export default router;