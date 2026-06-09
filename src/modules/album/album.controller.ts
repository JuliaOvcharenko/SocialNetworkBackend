import { AlbumService } from "./album.service";
import { AlbumControllerContract } from "./types/album.contracts";

export const AlbumController: AlbumControllerContract = {
    async create(req, res, next) {
        try {
            const album = await AlbumService.create(res.locals.userId, req.body);
            res.status(201).json(album);
        } catch (error) {
            next(error);
        }
    },

    async edit(req, res, next) {
        try {
            const album = await AlbumService.edit(res.locals.userId, Number(req.params.id), req.body);
            res.json(album);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const userId = req.query.userId ? Number(req.query.userId) : res.locals.userId;
            const albums = await AlbumService.getAll(userId);
            res.json(albums);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            await AlbumService.delete(res.locals.userId, Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};