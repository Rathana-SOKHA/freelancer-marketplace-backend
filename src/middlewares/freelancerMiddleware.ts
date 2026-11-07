import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./authMiddleware.js";
import { RoleType } from "../enums/roleType.js";

export function freelancerMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    if (req.user?.role !== RoleType.FREELANCER) {
        return res.status(403).json({
            success: false,
            message: "Freelancer account required",
        });
    }

    next();
}
