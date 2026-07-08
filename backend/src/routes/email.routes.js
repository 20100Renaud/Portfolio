import express, { Router } from "express";
import sendCoordinates from "../controllers/emails.controller.js";

const router = express.Router();

router.get("/", authMiddleware, sendCoordinates);

export default router;
