import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../config/prisma.js"
import { registerSchema } from "../validators/auth.schema.js"

export const register = async (req, res) => {

  const data = registerSchema.parse(req.body)

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword
    }
  })

  res.json(user)
}

export const login = async (req, res) => {

  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.json({ token })
}