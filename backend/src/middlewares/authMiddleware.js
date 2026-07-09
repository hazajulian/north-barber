// middlewares/authMiddleware.js
// Protege rutas privadas mediante token JWT.

import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token is missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
}