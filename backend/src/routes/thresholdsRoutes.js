import express from "express";
import { ThresholdsController } from "../controllers/thresholdsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", ThresholdsController.list);
router.post("/", authenticateToken, ThresholdsController.create);
router.get("/latest", ThresholdsController.latest);

export default router;
