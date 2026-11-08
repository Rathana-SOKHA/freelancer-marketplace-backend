import prisma from "../config/database.js";

export interface ClientProfileData {
    companyName?: string | null;
    companyWebsite?: string | null;
    companyDescription?: string | null;
    location?: string | null;
    companyLogoUrl?: string | null;
}

export class ClientProfileRepository {
    async findByUserId(userId: number) {
        return prisma.clientProfile.findUnique({
            where: { userId },
        });
    }

    async save(userId: number, data: ClientProfileData) {
        return prisma.clientProfile.upsert({
            where: { userId },
            create: {
                userId,
                ...data,
            },
            update: data,
        });
    }

    async create(userId: number, data: ClientProfileData) {
        return prisma.clientProfile.create({
            data: {
                userId,
                ...data,
            },
        });
    }
}

export const clientProfileRepository = new ClientProfileRepository();
