import { Router } from "express";
import { jobController } from "../controllers/jobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { clientMiddleware } from "../middlewares/clientMiddleware.js";

const router = Router();

router.use(authMiddleware, clientMiddleware);
router.get("/categories", (req, res) => jobController.getCategories(req, res));
router.get("/mine", (req, res) => jobController.getClientJobs(req, res));
router.post("/", (req, res) => jobController.createJob(req, res));

export default router;
