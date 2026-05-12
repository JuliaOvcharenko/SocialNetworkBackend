import { PhotoService } from "./photo.service";
import { BadRequestError } from "../../errors/app.errors";
import { PhotoControllerContract } from "./types/photo.contracts";
import { CreatePhoto, UpdatePhotoVisibility } from "./types/photo.types";


export const PhotoController: PhotoControllerContract = {
    create: async (req, res, next) => {
        try {
            const userId = res.locals.userId;
            const albumId = Number(req.params.id);

            if (!req.file) {
                throw new BadRequestError("No file uploaded");
            }

            const data: CreatePhoto = {
                photoName: req.file.filename,
            };

            const photo = await PhotoService.create(userId, albumId, data);

            res.status(201).json(photo);
        } catch (error) {
            next(error);
        }
    },

    updateVisibility: async (req, res, next) => {
        try {
            const userId = res.locals.userId;
            const albumId = Number(req.params.id);
            const photoId = Number(req.params.photoId);
            const data: UpdatePhotoVisibility = req.body;

            const photo = await PhotoService.updateVisibility(userId, albumId, photoId, data);

            res.status(200).json(photo);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (req, res, next) => {
        try {
            const requesterId = res.locals.userId;
            const albumId = Number(req.params.id);
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 20);

            const photos = await PhotoService.getAll(
                requesterId,
                albumId,
                requesterId,
                page,
                limit,
            );

            res.status(200).json(photos);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const userId = res.locals.userId;
            const albumId = Number(req.params.id);
            const photoId = Number(req.params.photoId);

            await PhotoService.delete(userId, albumId, photoId);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};