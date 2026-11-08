import { Router } from "express";
import { clientProfileController } from "../controllers/clientProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { clientMiddleware } from "../middlewares/clientMiddleware.js";

const router = Router();

router.use(authMiddleware, clientMiddleware);
router.get("/", (req, res) => clientProfileController.getProfile(req, res));
router.post("/", (req, res) => clientProfileController.createProfile(req, res));
router.put("/", (req, res) => clientProfileController.saveProfile(req, res));

export default router;
