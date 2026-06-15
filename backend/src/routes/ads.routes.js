import express from "express";
import { authMiddleware, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";
import {
  createAd,
  updateAd,
  deleteAd,
  getAllAds,
  createAnswer,
  updateAnswer,
  deleteAnswer
} from "../controllers/ads.controller.js";

const router = express.Router();

//---------------------------------------CRUD POST-----------------------------------------------
const preloadAd = async (req, res, next) => {
  const ad = await prisma.T_Ads.findUnique({
    where: { ID_Ad: req.params.adId }
  });
  if (!ad) return res.status(404).json({ error: "Ad not found" });
  req.ad = ad;
  next();
};

router.post("/", authMiddleware, createAd);
router.get("/", getAllAds);

router.put("/:id", authMiddleware, preloadAd, isOwnerOrAdmin(async (req) => req.ad.ID_User_Ad), updateAd);
router.delete("/:id", authMiddleware, preloadAd, isOwnerOrAdmin(async (req) => req.ad.ID_User_Ad), deleteAd);

router.post("/:adId/answers", authMiddleware, preloadAd, createAnswer);

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
