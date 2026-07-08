import express from "express";
import {
  updateImage,
  deleteImage,
  uploadImage,
} from "../controllers/images.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.put("/:id", authMiddleware, updateImage);

router.delete("/:id", authMiddleware, deleteImage);

router.post("/:depoId", authMiddleware, upload.array("images"), uploadImage);

export default router;
