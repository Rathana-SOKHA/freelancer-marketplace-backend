import {
    ExperienceLevel,
    FreelancerAvailability,
} from "../../generated/prisma/enums.js";
import {
    freelancerProfileRepository,
    type FreelancerProfileData,
} from "../repositories/freelancerProfileRepository.js";

const stringFieldLimits = {
    title: 150,
    location: 150,
    portfolioUrl: 500,
} as const;

const profileFields = [
    "title",
    "overview",
    "hourlyRate",
    "experienceLevel",
    "location",
    "portfolioUrl",
    "availability",
] as const;

export class FreelancerProfileError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

function validateProfileData(input: unknown): FreelancerProfileData {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new FreelancerProfileError("Request body must be an object", 400);
    }

    const body = input as Record<string, unknown>;
    const unknownField = Object.keys(body).find(
        (field) => !profileFields.includes(field as (typeof profileFields)[number])
    );

    if (unknownField) {
        throw new FreelancerProfileError(`Unknown profile field: ${unknownField}`, 400);
    }

    for (const [field, maxLength] of Object.entries(stringFieldLimits)) {
        const value = body[field];
        if (value !== undefined && value !== null) {
            if (typeof value !== "string") {
                throw new FreelancerProfileError(`${field} must be a string or null`, 400);
            }
            if (value.length > maxLength) {
                throw new FreelancerProfileError(`${field} must be at most ${maxLength} characters`, 400);
            }
        }
    }

    if (body.overview !== undefined && body.overview !== null && typeof body.overview !== "string") {
        throw new FreelancerProfileError("overview must be a string or null", 400);
    }

    const hourlyRate = body.hourlyRate;
    if (hourlyRate !== undefined && hourlyRate !== null) {
        if (
            typeof hourlyRate !== "number" ||
            !Number.isFinite(hourlyRate) ||
            hourlyRate < 0 ||
            hourlyRate > 99_999_999.99 ||
            String(hourlyRate).split(".")[1]?.length > 2
        ) {
            throw new FreelancerProfileError("hourlyRate must be a number between 0 and 99999999.99 with at most 2 decimal places", 400);
        }
    }

    if (
        body.experienceLevel !== undefined &&
        body.experienceLevel !== null &&
        !Object.values(ExperienceLevel).includes(body.experienceLevel as ExperienceLevel)
    ) {
        throw new FreelancerProfileError("Invalid experienceLevel", 400);
    }

    if (
        body.availability !== undefined &&
        !Object.values(FreelancerAvailability).includes(body.availability as FreelancerAvailability)
    ) {
        throw new FreelancerProfileError("Invalid availability", 400);
    }

    return Object.fromEntries(
        profileFields
            .filter((field) => body[field] !== undefined)
            .map((field) => [field, body[field]])
    ) as FreelancerProfileData;
}

export class FreelancerProfileService {
    async getProfile(userId: number) {
        const profile = await freelancerProfileRepository.findByUserId(userId);
        if (!profile) {
            throw new FreelancerProfileError("Freelancer profile not found", 404);
        }
        return profile;
    }

    async saveProfile(userId: number, input: unknown) {
        const data = validateProfileData(input);
        return freelancerProfileRepository.save(userId, data);
    }

    async createProfile(userId: number, input: unknown) {
        const data = validateProfileData(input);
        const existingProfile = await freelancerProfileRepository.findByUserId(userId);

        if (existingProfile) {
            throw new FreelancerProfileError("Freelancer profile already exists", 409);
        }

        return freelancerProfileRepository.create(userId, data);
    }
}

export const freelancerProfileService = new FreelancerProfileService();
