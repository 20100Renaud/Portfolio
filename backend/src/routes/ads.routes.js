import express from "express";
import { authMiddleware, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import prisma from "../prismaClient.js";
import {
  createAd,
  updateAd,
  deleteAd,
  getAllAds,
  createComment,
  updateComment,
  deleteComment
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

router.put("/:id", authMiddleware, preloadAd, isOwnerOrAdmin(async (req) => req.ad.ID_Client_Ad), updateAd);
router.delete("/:id", authMiddleware, preloadAd, isOwnerOrAdmin(async (req) => req.ad.ID_Client_Ad), deleteAd);

router.post("/:adId/comments", authMiddleware, preloadAd, createComment);

//---------------------------------------CRUD COMMENTS-----------------------------------------------
const preloadComment = async (req, res, next) => {
  const comment = await prisma.T_Comments.findUnique({
    where: { ID_Com: req.params.id }
  });
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  req.comment = comment;
  next();
};

router.put("/comments/:id", authMiddleware, preloadComment, isOwnerOrAdmin((req) => req.comment.ID_Client_Com), updateComment);
router.delete("/comments/:id", authMiddleware, preloadComment, isOwnerOrAdmin((req) => req.comment.ID_Client_Com), deleteComment);

export default router;
