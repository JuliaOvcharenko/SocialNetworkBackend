import { ForbiddenError, NotFoundError, ConflictError } from "../../errors/app.errors";
import { AlbumRepository } from "./album.repository";
import { AlbumServiceContract } from "./types/album.contracts";


export const AlbumService: AlbumServiceContract = {
    async create(userId, data) {
        return await AlbumRepository.create(userId, data);
    },

    async getAll(userId) {
        return await AlbumRepository.getAll(userId);
    },

    async edit(userId, albumId, data) {
        const album = await AlbumRepository.findById(albumId);

        if (!album) throw new NotFoundError("Album");
        if (album.userId !== userId) throw new ForbiddenError("Album does not belong to you");
        if (album.type === "system") throw new ForbiddenError("Cannot edit system album");

        return await AlbumRepository.edit(albumId, data);
    },

    async editVisibility(userId, albumId, data) {
        const album = await AlbumRepository.findById(albumId);

        if (!album) throw new NotFoundError("Album");
        if (album.userId !== userId) throw new ForbiddenError("Album does not belong to you"); 
        if (album.type === "system") throw new ForbiddenError("Cannot change visibility of system album");

        return await AlbumRepository.editVisibility(albumId, data);
    },

    async delete(userId, albumId) {
        const album = await AlbumRepository.findById(albumId);

        if (!album) throw new NotFoundError("Album");
        if (album.userId !== userId) throw new ForbiddenError("Album does not belong to you");
        if (album.type === "system") throw new ForbiddenError("Cannot delete system album");

        await AlbumRepository.delete(albumId);
    },
};