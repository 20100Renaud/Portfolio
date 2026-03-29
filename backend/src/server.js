import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import prisma from "./prismaClient.js";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api", protectedRoutes);

app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

app.get("/test", async (req, res) => {
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
