import prisma from "../config/database.js";
import type {
    JobExperienceLevel,
    JobStatus,
    JobType,
} from "../../generated/prisma/enums.js";

export interface CreateJobData {
    categoryId: number;
    title: string;
    description: string;
    jobType: JobType;
    experienceLevel: JobExperienceLevel;
    budgetMin: number | null;
    budgetMax: number | null;
    estimatedDuration: string | null;
    deadline: Date | null;
    status: JobStatus;
    skillIds: number[];
}

export interface CreateCategoryData {
    name: string;
    slug: string;
    description: string | null;
}

export class JobRepository {
    async findClientProfileByUserId(userId: number) {
        return prisma.clientProfile.findUnique({
            where: { userId },
            select: { id: true },
        });
    }

    async findActiveCategory(categoryId: number) {
        return prisma.category.findFirst({
            where: { id: categoryId, isActive: true },
            select: { id: true },
        });
    }

    async findSkillIds(skillIds: number[]) {
        const skills = await prisma.skill.findMany({
            where: { id: { in: skillIds } },
            select: { id: true },
        });
        return skills.map((skill) => skill.id);
    }

    async findActiveCategories() {
        return prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
            },
        });
    }

    async findCategoryByNameOrSlug(name: string, slug: string) {
        return prisma.category.findFirst({
            where: {
                OR: [
                    { name: { equals: name } },
                    { slug: { equals: slug } },
                ],
            },
            select: { id: true },
        });
    }

    async createCategory(data: CreateCategoryData) {
        return prisma.category.create({
            data,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
            },
        });
    }

    async create(clientProfileId: number, data: CreateJobData) {
        const { skillIds, ...jobData } = data;
        return prisma.job.create({
            data: {
                ...jobData,
                clientProfileId,
                jobSkills: {
                    create: skillIds.map((skillId) => ({
                        skill: { connect: { id: skillId } },
                    })),
                },
            },
            include: {
                category: true,
                jobSkills: { include: { skill: true } },
            },
        });
    }

    async findByClientUserId(userId: number) {
        return prisma.job.findMany({
            where: { clientProfile: { userId } },
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                jobSkills: { include: { skill: true } },
            },
        });
    }
}

export const jobRepository = new JobRepository();
