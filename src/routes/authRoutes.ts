import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const authController = new AuthController();

const router = Router();

// Public routes
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

// Private routes
router.get("/me", authMiddleware, (req, res) => authController.me(req, res));

export default router;