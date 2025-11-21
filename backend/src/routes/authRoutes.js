import express from "express";
import { AuthController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authenticateToken, AuthController.profile);

export default router;
