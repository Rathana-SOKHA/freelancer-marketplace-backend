import {
    JobExperienceLevel,
    JobStatus,
    JobType,
} from "../../generated/prisma/enums.js";
import { Prisma } from "../../generated/prisma/client.js";
import {
    jobRepository,
    type CreateCategoryData,
    type CreateJobData,
} from "../repositories/jobRepository.js";

const allowedFields = [
    "categoryId",
    "title",
    "description",
    "jobType",
    "experienceLevel",
    "budgetMin",
    "budgetMax",
    "estimatedDuration",
    "deadline",
    "skillIds",
    "status",
] as const;

export class JobError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

function validateBudget(value: unknown, field: string): number | null {
    if (value === undefined || value === null) {
        return null;
    }

    if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 99_999_999.99 ||
        String(value).split(".")[1]?.length > 2
    ) {
        throw new JobError(
            `${field} must be a number between 0 and 99999999.99 with at most 2 decimal places`,
            400
        );
    }

    return value;
}

function validateCreateCategory(input: unknown): CreateCategoryData {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new JobError("Request body must be an object", 400);
    }

    const body = input as Record<string, unknown>;
    const unknownField = Object.keys(body).find(
        (field) => field !== "name" && field !== "description"
    );
    if (unknownField) {
        throw new JobError(`Unknown category field: ${unknownField}`, 400);
    }

    if (typeof body.name !== "string" || !body.name.trim()) {
        throw new JobError("Category name is required", 400);
    }

    const name = body.name.trim();
    if (name.length > 100) {
        throw new JobError("Category name must be at most 100 characters", 400);
    }

    let description: string | null = null;
    if (body.description !== undefined && body.description !== null) {
        if (typeof body.description !== "string") {
            throw new JobError("Category description must be a string or null", 400);
        }
        description = body.description.trim() || null;
    }

    const slug = name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 120)
        .replace(/-$/g, "");

    if (!slug) {
        throw new JobError("Category name must contain letters or numbers", 400);
    }

    return { name, slug, description };
}

function validateCreateJob(input: unknown): CreateJobData {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new JobError("Request body must be an object", 400);
    }

    const body = input as Record<string, unknown>;
    const unknownField = Object.keys(body).find(
        (field) => !allowedFields.includes(field as (typeof allowedFields)[number])
    );
    if (unknownField) {
        throw new JobError(`Unknown job field: ${unknownField}`, 400);
    }

    if (!Number.isInteger(body.categoryId) || (body.categoryId as number) < 1) {
        throw new JobError("categoryId must be a positive integer", 400);
    }

    if (typeof body.title !== "string" || !body.title.trim()) {
        throw new JobError("title is required", 400);
    }
    if (body.title.trim().length > 200) {
        throw new JobError("title must be at most 200 characters", 400);
    }

    if (typeof body.description !== "string" || !body.description.trim()) {
        throw new JobError("description is required", 400);
    }

    if (!Object.values(JobType).includes(body.jobType as JobType)) {
        throw new JobError("jobType must be FIXED or HOURLY", 400);
    }
    if (
        !Object.values(JobExperienceLevel).includes(
            body.experienceLevel as JobExperienceLevel
        )
    ) {
        throw new JobError(
            "experienceLevel must be ENTRY, INTERMEDIATE, or EXPERT",
            400
        );
    }

    const budgetMin = validateBudget(body.budgetMin, "budgetMin");
    const budgetMax = validateBudget(body.budgetMax, "budgetMax");
    if (budgetMin !== null && budgetMax !== null && budgetMin > budgetMax) {
        throw new JobError("budgetMin cannot be greater than budgetMax", 400);
    }

    let estimatedDuration: string | null = null;
    if (body.estimatedDuration !== undefined && body.estimatedDuration !== null) {
        if (typeof body.estimatedDuration !== "string") {
            throw new JobError("estimatedDuration must be a string or null", 400);
        }
        estimatedDuration = body.estimatedDuration.trim() || null;
        if (estimatedDuration && estimatedDuration.length > 100) {
            throw new JobError("estimatedDuration must be at most 100 characters", 400);
        }
    }

    let deadline: Date | null = null;
    if (body.deadline !== undefined && body.deadline !== null && body.deadline !== "") {
        if (typeof body.deadline !== "string" || !Number.isFinite(Date.parse(body.deadline))) {
            throw new JobError("deadline must be a valid date string or null", 400);
        }
        deadline = new Date(body.deadline);
    }

    const skillIds = body.skillIds === undefined ? [] : body.skillIds;
    if (
        !Array.isArray(skillIds) ||
        !skillIds.every((id) => Number.isInteger(id) && id > 0) ||
        new Set(skillIds).size !== skillIds.length
    ) {
        throw new JobError("skillIds must be an array of unique positive integers", 400);
    }

    const status = body.status === undefined ? JobStatus.OPEN : body.status;
    if (status !== JobStatus.OPEN && status !== JobStatus.DRAFT) {
        throw new JobError("status must be OPEN or DRAFT", 400);
    }

    return {
        categoryId: body.categoryId as number,
        title: body.title.trim(),
        description: body.description.trim(),
        jobType: body.jobType as JobType,
        experienceLevel: body.experienceLevel as JobExperienceLevel,
        budgetMin,
        budgetMax,
        estimatedDuration,
        deadline,
        skillIds: skillIds as number[],
        status,
    };
}

export class JobService {
    async getActiveCategories() {
        return jobRepository.findActiveCategories();
    }

    async createCategory(input: unknown) {
        const data = validateCreateCategory(input);
        const existingCategory = await jobRepository.findCategoryByNameOrSlug(
            data.name,
            data.slug
        );
        if (existingCategory) {
            throw new JobError("A category with this name or slug already exists", 409);
        }

        try {
            return await jobRepository.createCategory(data);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new JobError("A category with this name or slug already exists", 409);
            }
            throw error;
        }
    }

    async getClientJobs(userId: number) {
        return jobRepository.findByClientUserId(userId);
    }

    async createJob(userId: number, input: unknown) {
        const data = validateCreateJob(input);
        const [clientProfile, category] = await Promise.all([
            jobRepository.findClientProfileByUserId(userId),
            jobRepository.findActiveCategory(data.categoryId),
        ]);

        if (!clientProfile) {
            throw new JobError("Create a client profile before posting a job", 404);
        }
        if (!category) {
            throw new JobError("Active category not found", 400);
        }

        const existingSkillIds = await jobRepository.findSkillIds(data.skillIds);
        if (existingSkillIds.length !== data.skillIds.length) {
            throw new JobError("One or more skillIds do not exist", 400);
        }

        return jobRepository.create(clientProfile.id, data);
    }
}

export const jobService = new JobService();
