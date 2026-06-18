import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import deposRoutes from "./routes/depos.routes.js";
import prisma from "./prismaClient.js";
import cookieParser from "cookie-parser";
import { startDepoCleanupJob } from "./jobs/cleanupDepos.job.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

startDepoCleanupJob();

app.use((req, res, next) => {
  console.log(`\n[REQ] ${req.method} ${req.url}`);
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
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/depos", deposRoutes);

app.get("/api/test", async (req, res) => {
  try {
    const users = await prisma.T_Users.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
