import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt.js";

// Extend Express Request to include decoded user
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Check HttpOnly cookie first, then fall back to Bearer header
    const cookieToken = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const token = cookieToken || headerToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authorization token missing or invalid format"
        });
    }

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
