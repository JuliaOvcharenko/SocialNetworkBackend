import { PhotoRepository } from "./photo.repository";
import { AlbumRepository } from "../album/album.repository";
import { ForbiddenError, NotFoundError, ConflictError } from "../../errors/app.errors";
import { PhotoServiceContract } from "./types/photo.contracts";
import { CreatePhoto, UpdatePhotoVisibility } from "./types/photo.types";

const MAX_PHOTOS_PER_ALBUM = 100;

export const PhotoService: PhotoServiceContract = {
    async create(userId, albumId, data) {
        const albumBigId = BigInt(albumId);
        const userBigId = BigInt(userId);

        const album = await AlbumRepository.findById(albumBigId);
        if (!album) throw new NotFoundError("Album");

        if (album.profileId !== userBigId) {
            throw new ForbiddenError("You are not the owner of this album");
        }

        const photosCount = await PhotoRepository.countByAlbum(albumBigId);
        if (photosCount >= MAX_PHOTOS_PER_ALBUM) {
            throw new ConflictError("You have reached the maximum number of photos in this album");
        }

        return await PhotoRepository.create(albumBigId, userBigId, data);
    },

    async updateVisibility(userId, albumId, photoId, data) {
        const albumBigId = BigInt(albumId);
        const photoBigId = BigInt(photoId);
        const userBigId = BigInt(userId);

        const album = await AlbumRepository.findById(albumBigId);
        if (!album) throw new NotFoundError("Album");

        if (album.profileId !== userBigId) {
            throw new ForbiddenError("You are not the owner of this album");
        }

        const photo = await PhotoRepository.findById(photoBigId);
        if (!photo) throw new NotFoundError("Photo");

        if (photo.albumId !== albumBigId) {
            throw new ForbiddenError("This photo does not belong to this album");
        }

        return await PhotoRepository.updateVisibility(photoBigId, data);
    },

    async getAll(userId, albumId, requesterId, page, limit) {
        const albumBigId = BigInt(albumId);
        const requesterBigId = BigInt(requesterId);

        const album = await AlbumRepository.findById(albumBigId);
        if (!album) throw new NotFoundError("Album");

        const isOwner = album.profileId === requesterBigId;
        const onlyPublic = !isOwner;

        return await PhotoRepository.getAll(albumBigId, onlyPublic, page, limit);
    },

    async delete(userId, albumId, photoId) {
        const albumBigId = BigInt(albumId);
        const photoBigId = BigInt(photoId);
        const userBigId = BigInt(userId);

        const album = await AlbumRepository.findById(albumBigId);
        if (!album) throw new NotFoundError("Album");

        if (album.profileId !== userBigId) {
            throw new ForbiddenError("You are not the owner of this album");
        }

        const photo = await PhotoRepository.findById(photoBigId);
        if (!photo) throw new NotFoundError("Photo");

        if (photo.albumId !== albumBigId) {
            throw new ForbiddenError("This photo does not belong to this album");
        }

        await PhotoRepository.delete(photoBigId);
    },
};
