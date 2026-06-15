import express from "express";
import { authMiddleware, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";
import {
  createDepot,
  updateDepot,
  deleteDepot,
  getAllDepots,
  createAnswer,
  updateAnswer,
  deleteAnswer
} from "../controllers/depots.controller.js";

const router = express.Router();

//---------------------------------------CRUD POST-----------------------------------------------
const preloadDepot = async (req, res, next) => {
  const depot = await prisma.T_Depots.findUnique({
    where: { ID_Depot: req.params.depotId }
  });
  if (!depot) return res.status(404).json({ error: "Depot not found" });
  req.depot = depot;
  next();
};

router.post("/", authMiddleware, createDepot);
router.get("/", getAllDepots);

router.put("/:id", authMiddleware, preloadDepot, isOwnerOrAdmin(async (req) => req.depot.ID_User_Depot), updateDepot);
router.delete("/:id", authMiddleware, preloadDepot, isOwnerOrAdmin(async (req) => req.depot.ID_User_Depot), deleteDepot);

router.post("/:depotId/answers", authMiddleware, preloadDepot, createAnswer);

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
