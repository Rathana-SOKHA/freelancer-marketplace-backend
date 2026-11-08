import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import {
    ClientProfileError,
    clientProfileService,
} from "../services/clientProfileService.js";

export class ClientProfileController {
    async createProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const profile = await clientProfileService.createProfile(req.user!.userId, req.body);
            return res.status(201).json({
                success: true,
                message: "Client profile created successfully",
                data: profile,
            });
        } catch (error) {
            if (error instanceof ClientProfileError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to create client profile", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create client profile",
            });
        }
    }

    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const profile = await clientProfileService.getProfile(req.user!.userId);
            return res.status(200).json({
                success: true,
                message: "Client profile fetched successfully",
                data: profile,
            });
        } catch (error) {
            if (error instanceof ClientProfileError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to fetch client profile", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch client profile",
            });
        }
    }

    async saveProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const profile = await clientProfileService.saveProfile(req.user!.userId, req.body);
            return res.status(200).json({
                success: true,
                message: "Client profile saved successfully",
                data: profile,
            });
        } catch (error) {
            if (error instanceof ClientProfileError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Failed to save client profile", error);
            return res.status(500).json({
                success: false,
                message: "Failed to save client profile",
            });
        }
    }
}

export const clientProfileController = new ClientProfileController();
