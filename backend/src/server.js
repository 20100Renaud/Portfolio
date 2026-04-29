import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import prisma from "./prismaClient.js";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/posts", postsRoutes);

app.get("/api/test", async (req, res) => {
  try {
    const clients = await prisma.T_Clients.findMany()
    res.json(clients)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`)
})

app.use((req, res, next) => {
  console.log(`\n[REQ] ${req.method} ${req.url}`);
  next();
});
