import { authRepository } from "../repositories/authRepository.js";
import { hashPassword, comparePasswords } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from "../utils/jwt.js";

export class AuthService {
    /**
   * Register a new user account.
   */
    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) {

        // 1. Check if user already exists
        const existingUser = await authRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email is already registered");
        }
        // 2. Hash password
        const passwordHash = await hashPassword(data.password);

        // 3. Create user in database
        const user = await authRepository.createUser({
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
        });

        // 4. Generate jwt tokens
        const tokenPayload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return { user, accessToken, refreshToken };
    }
}

export const authService = new AuthService();