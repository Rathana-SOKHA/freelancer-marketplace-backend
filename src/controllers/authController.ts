import { Request, Response } from "express";
import { authService } from "../services/authService.js";

export class AuthController {

  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Basic validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: email, password, firstName, lastName"
        })
      }

      const result = await authService.register({ email, password, firstName, lastName });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      })

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response) {

  }

  async logout(req: Request, res: Response) {

  }

  async profile(req: Request, res: Response) {

  }
}