import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
const authController = new AuthController();

const router = Router();

// Public routes
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

// Private routes

export default router;