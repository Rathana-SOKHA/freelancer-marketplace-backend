import {
    clientProfileRepository,
    type ClientProfileData,
} from "../repositories/clientProfileRepository.js";

const stringFieldLimits = {
    companyName: 150,
    companyWebsite: 255,
    location: 150,
    companyLogoUrl: 500,
} as const;

const profileFields = [
    "companyName",
    "companyWebsite",
    "companyDescription",
    "location",
    "companyLogoUrl",
] as const;

export class ClientProfileError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

function validateProfileData(input: unknown): ClientProfileData {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new ClientProfileError("Request body must be an object", 400);
    }

    const body = input as Record<string, unknown>;
    const unknownField = Object.keys(body).find(
        (field) => !profileFields.includes(field as (typeof profileFields)[number])
    );

    if (unknownField) {
        throw new ClientProfileError(`Unknown profile field: ${unknownField}`, 400);
    }

    for (const [field, maxLength] of Object.entries(stringFieldLimits)) {
        const value = body[field];
        if (value !== undefined && value !== null) {
            if (typeof value !== "string") {
                throw new ClientProfileError(`${field} must be a string or null`, 400);
            }
            if (value.length > maxLength) {
                throw new ClientProfileError(
                    `${field} must be at most ${maxLength} characters`,
                    400
                );
            }
        }
    }

    if (
        body.companyDescription !== undefined &&
        body.companyDescription !== null &&
        typeof body.companyDescription !== "string"
    ) {
        throw new ClientProfileError("companyDescription must be a string or null", 400);
    }

    return Object.fromEntries(
        profileFields
            .filter((field) => body[field] !== undefined)
            .map((field) => [field, body[field]])
    ) as ClientProfileData;
}

export class ClientProfileService {
    async getProfile(userId: number) {
        const profile = await clientProfileRepository.findByUserId(userId);
        if (!profile) {
            throw new ClientProfileError("Client profile not found", 404);
        }
        return profile;
    }

    async saveProfile(userId: number, input: unknown) {
        const data = validateProfileData(input);
        return clientProfileRepository.save(userId, data);
    }

    async createProfile(userId: number, input: unknown) {
        const data = validateProfileData(input);
        const existingProfile = await clientProfileRepository.findByUserId(userId);

        if (existingProfile) {
            throw new ClientProfileError("Client profile already exists", 409);
        }

        return clientProfileRepository.create(userId, data);
    }
}

export const clientProfileService = new ClientProfileService();
