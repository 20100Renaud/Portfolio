import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../../prisma.config.js"
import { registerSchema } from "../validators/auth.schema.js"

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.client.create({
      data: {
        Login_Client: data.login,
        Mail_Client: data.email,
        Password_Client: hashedPassword
      }
    })
    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error"})
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.client.findUnique({
      where: { Mail_Client: email }
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.Password_Client)

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { clientId: user.ID_Client },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
