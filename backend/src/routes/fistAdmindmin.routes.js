import express from "express";
import { createUser } from "../controllers/clients.controller.js";
import { firstAdminOnly } from "../middleware/firstAdmin.middleware.js";

const router = express.Router();

router.post("/first-admin", firstAdminOnly, createUser);
