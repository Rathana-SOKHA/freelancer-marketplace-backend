import { authRepository } from "../repositories/authRepository.js";
import { hashPassword, comparePasswords } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { RoleType } from "../enums/roleType.js";

export class AuthService {
    /**
   * Register a new user account.
   */
    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: RoleType;
    }) {

        // validate role
        if (!Object.values(RoleType).includes(data.role)) {
            throw new Error("Invalid role type");
        }

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
            role: data.role
        });

        // 4. Generate jwt tokens
        const tokenPayload = { userId: user.id, email: user.email, role: data.role };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return {
            user: {
                ...user,
                role: data.role,
            },
            accessToken,
            refreshToken
        };
    }

    /**
  * Login a user.
  */

    async login(credentials: { email: string; password: string }) {
        // 1. Find user by email
        const user = await authRepository.findByEmail(credentials.email);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        // 2. Compare password
        const isPasswordValid = await comparePasswords(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        // extract role from userRoles
        const userRole = user.userRoles[0]?.role?.name;

        // 3. Generate jwt tokens
        const tokenPayload = { userId: user.id, email: user.email, role: userRole };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return { 
            user: {
                ...user,
                role: userRole
            },
            accessToken,
            refreshToken
        };
    }

    /**
  * Get profile
  */

    async getProfile(userId: number) {
        const user = await authRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const userRole = user.userRoles[0]?.role?.name;
        return { user, role: userRole};
    }

    /**
  * Logout
  */

    async logout(_userId: number) {
        return { message: "Logout successful" };
    }
}


export const authService = new AuthService();