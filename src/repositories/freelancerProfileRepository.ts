import prisma from "../config/database.js";
import type { ExperienceLevel, FreelancerAvailability } from "../../generated/prisma/enums.js";

export interface FreelancerProfileData {
    title?: string | null;
    overview?: string | null;
    hourlyRate?: number | null;
    experienceLevel?: ExperienceLevel | null;
    location?: string | null;
    portfolioUrl?: string | null;
    availability?: FreelancerAvailability;
}

export class FreelancerProfileRepository {
    async findDirectoryProfiles() {
        return prisma.freelancerProfile.findMany({
            where: {
                user: {
                    is: {
                        status: "ACTIVE",
                        userRoles: {
                            some: {
                                role: {
                                    is: { name: "FREELANCER" },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                title: true,
                overview: true,
                hourlyRate: true,
                experienceLevel: true,
                location: true,
                portfolioUrl: true,
                availability: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    async findByUserId(userId: number) {
        return prisma.freelancerProfile.findUnique({
            where: { userId },
        });
    }

    async save(userId: number, data: FreelancerProfileData) {
        return prisma.freelancerProfile.upsert({
            where: { userId },
            create: {
                userId,
                ...data,
            },
            update: data,
        });
    }

    async create(userId: number, data: FreelancerProfileData) {
        return prisma.freelancerProfile.create({
            data: {
                userId,
                ...data,
            },
        });
    }
}

export const freelancerProfileRepository = new FreelancerProfileRepository();
