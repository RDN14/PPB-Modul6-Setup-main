import { jwtUtils } from "../utils/jwtUtils.js";

/**
 * Middleware to authenticate JWT token from Authorization header
 * Adds user info to req.user if token is valid
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};
