import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt.js";

// Extend Express Request to include decoded user
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization token missing or invalid format"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

}