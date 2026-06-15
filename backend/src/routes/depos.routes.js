import express from "express";
import { authMiddleware, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";
import {
  createDepo,
  updateDepo,
  deleteDepo,
  getAllDepos,
  createAnswer,
  updateAnswer,
  deleteAnswer
} from "../controllers/depos.controller.js";

const router = express.Router();

//---------------------------------------CRUD POST-----------------------------------------------
const preloadDepo = async (req, res, next) => {
  const depo = await prisma.T_Depos.findUnique({
    where: { ID_Depo: req.params.id },
    include: {
      User_Depos: true,
      Answers_Depos: {
        include: { User_Answers: true }
      }
    }
  });
  if (!depo) return res.status(404).json({ error: "Depo not found" });
  req.depo = depo;
  next();
};

router.post("/", authMiddleware, createDepo);
router.get("/", getAllDepos);

router.get("/:id", preloadDepo, (req, res) => {
  res.json(req.depo);
});
router.put("/:id", authMiddleware, preloadDepo, isOwnerOrAdmin(async (req) => req.depo.ID_User_Depo), updateDepo);
router.delete("/:id", authMiddleware, preloadDepo, isOwnerOrAdmin(async (req) => req.depo.ID_User_Depo), deleteDepo);

router.post("/:id/answers", authMiddleware, preloadDepo, createAnswer);

//---------------------------------------CRUD COMMENTS-----------------------------------------------
const preloadAnswer = async (req, res, next) => {
  const answer = await prisma.T_Answers.findUnique({
    where: { ID_Com: req.params.id }
  });
  if (!answer) return res.status(404).json({ error: "Answer not found" });
  req.answer = answer;
  next();
};

router.put("/answers/:id", authMiddleware, preloadAnswer, isOwnerOrAdmin((req) => req.answer.ID_User_Com), updateAnswer);
router.delete("/answers/:id", authMiddleware, preloadAnswer, isOwnerOrAdmin((req) => req.answer.ID_User_Com), deleteAnswer);

export default router;
