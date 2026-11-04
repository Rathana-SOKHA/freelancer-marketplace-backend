import prisma from "../config/database.js";

export interface CreateUserData {
    email: string;
    passwordHash: string,
    firstName: string;
    lastName: string;
}

export class AuthRepository {

    // Find a user by email
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    // Find a user by ID
    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    // Create a new user
    async createUser(data: CreateUserData) {
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
            }, 

            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }

    
}

export const authRepository = new AuthRepository();