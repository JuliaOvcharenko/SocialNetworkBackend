import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { AlbumRepositoryContract } from "./types/album.contracts";
import { prisma } from "../../prisma/client";

function handlePrismaError(error: unknown): Error {
    console.error("Prisma error:", error);
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") return new NotFoundError("Album");
        return new InternalServerError(`DB_ERROR: ${error.code}`);
    }
    return new InternalServerError();
}

export const AlbumRepository: AlbumRepositoryContract = {
    async create(profileId, data) {
        try {
            const { name, theme, year, isShown } = data;
            return await prisma.album.create({
                data: { name, theme, year, isShown, profileId, isDefault: false },
                include: { images: true },
            });
        } catch (error) {
            console.error("Album create error:", error);
            throw handlePrismaError(error);
        }
    },

    async edit(id, data) {
        try {
            return await prisma.album.update({
                where: { id },
                data,
                include: { images: true },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async getAll(profileId) {
        try {
            return await prisma.album.findMany({
                where: { profileId },
                include: { images: true },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async delete(id) {
        try {
            await prisma.album.delete({ where: { id } });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async findById(id) {
        try {
            return await prisma.album.findUnique({
                where: { id },
                include: { images: true, profile: true },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },
};
