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
} from "../controllers/depos.controller.js";
import {createAnswer} from "../controllers/answers.controller.js";

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

export default router;
