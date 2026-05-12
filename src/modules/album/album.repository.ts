import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { InternalServerError, NotFoundError } from "../../errors/app.errors";
import { AlbumRepositoryContract } from "./types/album.contracts";
import { prisma } from "../../prisma/client";
import { Album } from "./types/album.types";


function handlePrismaError(error: unknown): Error {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            return new NotFoundError("Album");
        }
        return new InternalServerError(`DB_ERROR: ${error.code}`);
    }
    return new InternalServerError();
}

export const AlbumRepository: AlbumRepositoryContract = {
    async create(userId, data) {
        try {
            return await prisma.album.create({
                data: { ...data, userId, type: "custom" },
            });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async edit(id, data) {
        try {
            return await prisma.album.update({ where: { id }, data });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async editVisibility(id, data) {
        try {
            return await prisma.album.update({ where: { id }, data });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },

    async getAll(userId: number): Promise<Album[]> {
        const albums = await prisma.album.findMany({
            where: { userId },
            include: {
                images: {
                    include: { image: true }
                },
                avatars: {
                    include: { avatar: { include: { image: true } } }
                },
            },
        });
        return albums;
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
            return await prisma.album.findUnique({ where: { id } });
        } catch (error) {
            throw handlePrismaError(error);
        }
    },
};