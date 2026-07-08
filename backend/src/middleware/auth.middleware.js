import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import cookieParser from "cookie-parser";

export const authMiddleware = async (req, res, next) => {
  console.log("AUTH MIDDLEWARE HIT");

  const token = req.cookies.token;
  console.log("COOKIE TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED JWT:", decoded);

    const user = await prisma.T_Users.findUnique({
      where: {
        ID_User: decoded.userId,
      },
    });

    if (!user) {
      res.clearCookie("token");
      console.log("USER NOT FOUND");

      return res.status(401).json({
        error: "User no longer exists",
      });
    }

    req.user = decoded;
    console.log("AUTH CHECK");

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export const isOwnerOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      const resourceOwnerId = await getOwnerId(req);

      if (req.user.role === "ADMIN" || req.user.userId === resourceOwnerId) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  };
};
