import { Router } from "express";
import { freelancerProfileController } from "../controllers/freelancerProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { clientMiddleware } from "../middlewares/clientMiddleware.js";

const router = Router();

router.use(authMiddleware, clientMiddleware);
router.get("/", (req, res) =>
    freelancerProfileController.getDirectoryProfiles(req, res)
);

export default router;
