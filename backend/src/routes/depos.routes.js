import express from "express";
import {
  authMiddleware,
  isOwnerOrAdmin,
} from "../middleware/auth.middleware.js";
import { preloadDepo } from "../middleware/depo.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import prisma from "../prismaClient.js";
import {
  createDepo,
  updateDepo,
  deleteDepo,
  getAllDepos,
  getMyDepos,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from "../controllers/depos.controller.js";


const router = express.Router();

//--------------------CRUD DEPOS-----------------
router.get("/", getAllDepos);
router.get("/dashboard", authMiddleware, getMyDepos);
router.get("/:id", preloadDepo, (req, res) => {
  res.json(req.depo);
});

router.post("/", authMiddleware, upload.array("images", 5), createDepo);
router.post("/:id/answers", authMiddleware, preloadDepo, createAnswer);

router.put(
  "/:id",
  authMiddleware,
  preloadDepo,
  isOwnerOrAdmin((req) => req.depo.ID_User),
  updateDepo,
);

router.delete(
  "/:id",
  authMiddleware,
  preloadDepo,
  isOwnerOrAdmin((req) => req.depo.ID_User),
  deleteDepo,
);



//------------------CRUD ANSWERS--------------------------
const preloadAnswer = async (req, res, next) => {
  const answer = await prisma.T_Answers.findUnique({
    where: { ID_Answer: req.params.id },
  });
  if (!answer) return res.status(404).json({ error: "Answer not found" });
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
