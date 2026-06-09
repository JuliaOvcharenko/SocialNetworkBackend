import { ForbiddenError, NotFoundError } from "../../errors/app.errors";
import { AlbumRepository } from "./album.repository";
import { AlbumServiceContract } from "./types/album.contracts";
import { prisma } from "../../prisma/client";

async function getProfileIdByUserId(userId: number): Promise<bigint> {
    const profile = await prisma.profile.findUnique({
        where: { userId: BigInt(userId) },
    });
    if (!profile) throw new NotFoundError("Profile");
    return profile.id;
}

export const AlbumService: AlbumServiceContract = {
    async create(userId, data) {
        const profileId = await getProfileIdByUserId(userId);
        return await AlbumRepository.create(profileId, data);
    },

    async getAll(userId) {
        const profileId = await getProfileIdByUserId(userId);
        return await AlbumRepository.getAll(profileId);
    },

    async edit(userId, albumId, data) {
        const profileId = await getProfileIdByUserId(userId);
        const album = await AlbumRepository.findById(BigInt(albumId));

        if (!album) throw new NotFoundError("Album");
        if (album.profileId !== profileId) throw new ForbiddenError("Album does not belong to you");
        if (album.isDefault) throw new ForbiddenError("Cannot edit default album");

        return await AlbumRepository.edit(BigInt(albumId), data);
    },

    async delete(userId, albumId) {
        const profileId = await getProfileIdByUserId(userId);
        const album = await AlbumRepository.findById(BigInt(albumId));

        if (!album) throw new NotFoundError("Album");
        if (album.profileId !== profileId) throw new ForbiddenError("Album does not belong to you");
        if (album.isDefault) throw new ForbiddenError("Cannot delete default album");

        await AlbumRepository.delete(BigInt(albumId));
    },
};
