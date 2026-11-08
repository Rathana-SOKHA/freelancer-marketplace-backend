import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./authMiddleware.js";
import { RoleType } from "../enums/roleType.js";

export function clientMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    if (req.user?.role !== RoleType.CLIENT) {
        return res.status(403).json({
            success: false,
            message: "Client account required",
        });
    }

    next();
}
