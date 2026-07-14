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
import { CreateLimiter, UpdateLimiter } from "../middleware/depo.middleware.js";

const router = express.Router();

//--------------------CRUD DEPOS-----------------
router.get("/", getAllDepos);
router.get("/dashboard", authMiddleware, getMyDepos);
router.get("/:id", preloadDepo, (req, res) => {
  res.json(req.depo);
});

router.post(
  "/",
  (req, res, next) => {
    console.log("[ROUTE HIT /depos]");
    next();
  },
  authMiddleware,
  CreateLimiter,
  (req, res, next) => {
    upload.array("images", 5)(req, res, function (err) {
      if (err) {
        console.error("[MULTER ERROR]:", err);
        return res.status(400).json({ error: err.message });
      }

      console.log("[MULTER PASSED]");
      console.log("FILES:", req.files);
      console.log("BODY:", req.body);

      next();
    });
  },
  createDepo,
);

router.post("/:id/answers", authMiddleware, CreateLimiter, preloadDepo, createAnswer);

router.put(
  "/:id",
  authMiddleware,
  UpdateLimiter,
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
