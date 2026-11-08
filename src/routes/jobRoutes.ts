import { Router } from "express";
import { jobController } from "../controllers/jobController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { clientMiddleware } from "../middlewares/clientMiddleware.js";
import { freelancerMiddleware } from "../middlewares/freelancerMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/browse", freelancerMiddleware, (req, res) =>
    jobController.getOpenJobs(req, res)
);
router.get("/categories", clientMiddleware, (req, res) =>
    jobController.getCategories(req, res)
);
router.post("/categories", clientMiddleware, (req, res) =>
    jobController.createCategory(req, res)
);
router.get("/mine", clientMiddleware, (req, res) =>
    jobController.getClientJobs(req, res)
);
router.post("/", clientMiddleware, (req, res) =>
    jobController.createJob(req, res)
);

export default router;
