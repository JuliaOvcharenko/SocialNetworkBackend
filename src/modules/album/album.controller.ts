import { AlbumService } from "./album.service";
import { AlbumControllerContract } from "./types/album.contracts";

export const AlbumController: AlbumControllerContract = {
    async create(req, res, next) {
        try {
            const userId = res.locals.userId;
            const album = await AlbumService.create(userId, req.body);
            res.status(201).json(album);
        } catch (error) {
            next(error);
        }
    },

    async edit(req, res, next) {
        try {
            const userId = res.locals.userId;
            const albumId = Number(req.params.id);
            const album = await AlbumService.edit(userId, albumId, req.body);
            res.json(album);
        } catch (error) {
            next(error);
        }
    },

    async editVisibility(req, res, next) {
        try {
            const userId = res.locals.userId;
            const albumId = Number(req.params.id);
            const album = await AlbumService.editVisibility(userId, albumId, req.body);
            res.json(album);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const userId = res.locals.userId;
            const albums = await AlbumService.getAll(userId);
            res.json(albums);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const userId = res.locals.userId;
            const albumId = Number(req.params.id);
            await AlbumService.delete(userId, albumId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};
