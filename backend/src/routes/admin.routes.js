import express from "express";
import { createFirstAdmin } from "../controllers/admin.controller.js";
import { firstAdminOnly } from "../middleware/firstAdmin.middleware.js";

const router = express.Router();

router.post("/first-admin", firstAdminOnly, createFirstAdmin);

export default router;