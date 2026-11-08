import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { JobError, jobService } from "../services/jobService.js";

export class JobController {
    async getOpenJobs(_req: AuthenticatedRequest, res: Response) {
        try {
            const jobs = await jobService.getOpenJobs();
            return res.status(200).json({
                success: true,
                message: "Open jobs fetched successfully",
                data: jobs,
            });
        } catch (error) {
            console.error("Failed to fetch open jobs", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch open jobs",
            });
        }
    }

    async createCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const category = await jobService.createCategory(req.body);
            return res.status(201).json({
                success: true,
                message: "Job category created successfully",
                data: category,
            });
        } catch (error) {
            if (error instanceof JobError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to create job category", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create job category",
            });
        }
    }

    async createJob(req: AuthenticatedRequest, res: Response) {
        try {
            const job = await jobService.createJob(req.user!.userId, req.body);
            return res.status(201).json({
                success: true,
                message: "Job posted successfully",
                data: job,
            });
        } catch (error) {
            if (error instanceof JobError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to post job", error);
            return res.status(500).json({
                success: false,
                message: "Failed to post job",
            });
        }
    }

    async getClientJobs(req: AuthenticatedRequest, res: Response) {
        try {
            const jobs = await jobService.getClientJobs(req.user!.userId);
            return res.status(200).json({
                success: true,
                message: "Client jobs fetched successfully",
                data: jobs,
            });
        } catch (error) {
            console.error("Failed to fetch client jobs", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch client jobs",
            });
        }
    }

    async getCategories(_req: AuthenticatedRequest, res: Response) {
        try {
            const categories = await jobService.getActiveCategories();
            return res.status(200).json({
                success: true,
                message: "Active job categories fetched successfully",
                data: categories,
            });
        } catch (error) {
            console.error("Failed to fetch job categories", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch job categories",
            });
        }
    }
}

export const jobController = new JobController();
