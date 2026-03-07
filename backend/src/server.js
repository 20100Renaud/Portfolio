import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import prisma from "../prisma.config.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)

app.get("/test", async (req, res) => {
  try {
    const clients = await prisma.client.findMany()
    res.json(clients)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
