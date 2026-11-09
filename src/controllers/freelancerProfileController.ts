import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import {
    FreelancerProfileError,
    freelancerProfileService,
} from "../services/freelancerProfileService.js";

export class FreelancerProfileController {
    async getDirectoryProfiles(_req: AuthenticatedRequest, res: Response) {
        try {
            const profiles = await freelancerProfileService.getDirectoryProfiles();
            return res.status(200).json({
                success: true,
                message: "Freelancers fetched successfully",
                data: profiles,
            });
        } catch (error) {
            console.error("Failed to fetch freelancers", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch freelancers",
            });
        }
    }

    async createProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const profile = await freelancerProfileService.createProfile(req.user!.userId, req.body);
            return res.status(201).json({
                success: true,
                message: "Freelancer profile created successfully",
                data: profile,
            });
        } catch (error) {
            if (error instanceof FreelancerProfileError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to create freelancer profile", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create freelancer profile",
            });
        }
    }

    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const profile = await freelancerProfileService.getProfile(req.user!.userId);
            return res.status(200).json({
                success: true,
                message: "Freelancer profile fetched successfully",
                data: profile,
            });
        } catch (error) {
            if (error instanceof FreelancerProfileError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to fetch freelancer profile", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch freelancer profile",
            });
        }
    }

    async saveProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const profile = await freelancerProfileService.saveProfile(req.user!.userId, req.body);
            return res.status(200).json({
                success: true,
                message: "Freelancer profile saved successfully",
                data: profile,
            });
        } catch (error) {
            if (error instanceof FreelancerProfileError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to save freelancer profile", error);
            return res.status(500).json({
                success: false,
                message: "Failed to save freelancer profile",
            });
        }
    }
}

export const freelancerProfileController = new FreelancerProfileController();
