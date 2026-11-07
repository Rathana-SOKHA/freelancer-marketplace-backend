import prisma from "../config/database.js";
import { RoleType } from "../enums/roleType.js"

export interface CreateUserData {
    email: string;
    passwordHash: string,
    firstName: string;
    lastName: string;
    role: RoleType
}

export class AuthRepository {

    // Find a user by email
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
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
                userRoles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
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
                userRoles: {
                    create: {
                        role: {
                            connectOrCreate: {
                                where: { name: data.role },
                                create: { name: data.role }
                            }
                        }
                    }
                }
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