import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: "Invalid token" })
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

      if (req.user.role === "ADMIN" || req.user.clientId === resourceOwnerId) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  };
};
