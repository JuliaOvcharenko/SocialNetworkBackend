import { PhotoRepository } from "./photo.repository";
import { AlbumRepository } from "../album/album.repository";
import { ForbiddenError, NotFoundError, ConflictError } from "../../errors/app.errors";
import { PhotoServiceContract } from "./types/photo.contracts";


const MAX_PHOTOS_PER_ALBUM = 100;

export const PhotoService: PhotoServiceContract = {
    create: async (userId, albumId, data) => {
        const album = await AlbumRepository.findById(albumId);

        if (!album) {
            throw new NotFoundError("Album not found");
        }

        if (album.userId !== userId) {
            throw new ForbiddenError("You are not the owner of this album");
        }

        if (album.type === "system") {
            throw new ForbiddenError("You cannot add photos to a system album");
        }

        const photosCount = await PhotoRepository.countByAlbum(albumId);

        if (photosCount >= MAX_PHOTOS_PER_ALBUM) {
            throw new ConflictError("You have reached the maximum number of photos in this album");
        }

        const photo = await PhotoRepository.create(albumId, userId, data);

        return photo;
    },

    updateVisibility: async (userId, albumId, photoId, data) => {
        const album = await AlbumRepository.findById(albumId);

        if (!album) {
            throw new NotFoundError("Album not found");
        }

        if (album.userId !== userId) {
            throw new ForbiddenError("You are not the owner of this album");
        }

        const photo = await PhotoRepository.findById(photoId);

        if (!photo) {
            throw new NotFoundError("Photo not found");
        }

        if (photo.albumId !== albumId) {
            throw new ForbiddenError("This photo does not belong to this album");
        }

        const updatedPhoto = await PhotoRepository.updateVisibility(photoId, data);

        return updatedPhoto;
    },

    getAll: async (userId, albumId, requesterId, page, limit) => {
        const album = await AlbumRepository.findById(albumId);

        if (!album) {
            throw new NotFoundError("Album not found");
        }

        const isOwner = album.userId === requesterId;
        const onlyPublic = !isOwner;

        const photos = await PhotoRepository.getAll(albumId, onlyPublic, page, limit);

        return photos;
    },

    delete: async (userId, albumId, photoId) => {
        const album = await AlbumRepository.findById(albumId);

        if (!album) {
            throw new NotFoundError("Album not found");
        }

        if (album.userId !== userId) {
            throw new ForbiddenError("You are not the owner of this album");
        }

        const photo = await PhotoRepository.findById(photoId);

        if (!photo) {
            throw new NotFoundError("Photo not found");
        }

        if (photo.albumId !== albumId) {
            throw new ForbiddenError("This photo does not belong to this album");
        }

        await PhotoRepository.delete(photoId);
    },
};