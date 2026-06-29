import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import prisma from "./prismaClient.js";

import authRoutes from "./routes/auth.routes.js";
import deposRoutes from "./routes/depos.routes.js";
import citiesRoutes from "./routes/cities.routes.js";

import { startDepoCleanupJob } from "./jobs/cleanupDepos.job.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

startDepoCleanupJob();

// --------------- Global middleware ---------------
app.use((req, res, next) => {
  if (req.url !== "/health") {
    console.log(`[REQ] ${req.method} ${req.url}`);
  }
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// --------------- Static files ---------------
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "public")));

// --------------- API routes ---------------
app.use("/api/auth", authRoutes);
app.use("/api/depos", deposRoutes);
app.use("/api/cities", citiesRoutes);

// --------------- Specific endpoints ---------------
app.get("/api/test", async (req, res) => {
  try {
    const users = await prisma.T_Users.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// --------------- Frontend fallback ---------------
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;