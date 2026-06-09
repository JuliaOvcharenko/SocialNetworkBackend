
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../prisma/client";
import { PhotoRepositoryContract } from "./types/photo.contracts";
import { Photo } from "./types/photo.types";

type AlbumImageWithProfile = Prisma.AlbumImageGetPayload<{
    include: { album: { include: { profile: true } } };
}>;

function mapToPhoto(albumImage: AlbumImageWithProfile): Photo {
    return {
        id:         albumImage.id,
        albumId:    albumImage.albumId,
        userId:     albumImage.album.profile.userId,
        photoName:  albumImage.image,
        visibility: albumImage.isShown ? "public" : "private",
        createdAt:  albumImage.createdAt,
    };
}

export const PhotoRepository: PhotoRepositoryContract = {
    create: async (albumId, userId, data) => {
        const albumImage = await prisma.albumImage.create({
            data: {
                image:   data.photoName,
                isShown: false,
                albumId,
            },
            include: { album: { include: { profile: true } } },
        });

        return mapToPhoto(albumImage);
    },

    updateVisibility: async (photoId, data) => {
        const updated = await prisma.albumImage.update({
            where:   { id: photoId },
            data:    { isShown: data.visibility === "public" },
            include: { album: { include: { profile: true } } },
        });

        return mapToPhoto(updated);
    },

    getAll: async (albumId, onlyPublic, page, limit) => {
        const albumImages = await prisma.albumImage.findMany({
            where: {
                albumId,
                ...(onlyPublic ? { isShown: true } : {}),
            },
            include: { album: { include: { profile: true } } },
            skip: (page - 1) * limit,
            take: limit,
        });

        return albumImages.map(mapToPhoto);
    },

    delete: async (photoId) => {
        await prisma.albumImage.delete({ where: { id: photoId } });
    },

    findById: async (photoId) => {
        const found = await prisma.albumImage.findFirst({
            where:   { id: photoId },
            include: { album: { include: { profile: true } } },
        });

        if (!found) return null;
        return mapToPhoto(found);
    },

    countByAlbum: async (albumId) => {
        return await prisma.albumImage.count({ where: { albumId } });
    },
};