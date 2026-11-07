import { Router } from "express";
import { freelancerProfileController } from "../controllers/freelancerProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { freelancerMiddleware } from "../middlewares/freelancerMiddleware.js";

const router = Router();

router.use(authMiddleware, freelancerMiddleware);
router.get("/", (req, res) => freelancerProfileController.getProfile(req, res));
router.post("/", (req, res) => freelancerProfileController.createProfile(req, res));
router.put("/", (req, res) => freelancerProfileController.saveProfile(req, res));

export default router;
