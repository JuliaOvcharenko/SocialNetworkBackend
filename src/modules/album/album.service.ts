import { ForbiddenError, NotFoundError, ConflictError } from "../../errors/app.errors";
import { AlbumRepository } from "./album.repository";
import { AlbumServiceContract } from "./types/album.contracts";


export const AlbumService: AlbumServiceContract = {
    async create(userId, data) {
        const albums = await AlbumRepository.getAll(userId);

        const customAlbums = albums.filter((a) => a.type === "custom");
        if (customAlbums.length >= 1) {
            throw new ConflictError("You can only have one custom album");
        }

        return await AlbumRepository.create(userId, data);
    },

    async edit(userId, albumId, data) {
        const album = await AlbumRepository.findById(albumId);

        if (!album) throw new NotFoundError("Album");
        if (album.type === "system") throw new ForbiddenError("Cannot edit system album");

        return await AlbumRepository.edit(albumId, data);
    },

    async editVisibility(userId, albumId, data) {
        const album = await AlbumRepository.findById(albumId);

        if (!album) throw new NotFoundError("Album");
        if (album.type === "system") throw new ForbiddenError("Cannot change visibility of system album");

        return await AlbumRepository.editVisibility(albumId, data);
    },

    async getAll(userId) {
        return await AlbumRepository.getAll(userId);
    },

    async delete(userId, albumId) {
        const album = await AlbumRepository.findById(albumId);

        if (!album) throw new NotFoundError("Album");
        if (album.type === "system") throw new ForbiddenError("Cannot delete system album");

        await AlbumRepository.delete(albumId);
    },
};