import { prisma } from "../../prisma/client";
import { PhotoRepositoryContract } from "./types/photo.contracts";


export const PhotoRepository: PhotoRepositoryContract = {
    create: async (albumId, userId, data) => {
        const image = await prisma.image.create({
            data: {
                pathname: data.photoName,
                albumImages: {
                    create: {
                        albumId,
                    },
                },
            },
        });

        const albumImage = await prisma.albumImages.findFirst({
            where: { imageId: image.id, albumId },
            include: { image: true },
        });

        return mapToPhoto(albumImage!, userId);
    },

    updateVisibility: async (photoId, data) => {
        const updated = await prisma.albumImages.findFirstOrThrow({
            where: { id: photoId },
            include: { image: true, album: { include: { user: true } } },
        });

        return mapToPhoto(updated, updated.album.userId);
    },

    getAll: async (albumId, onlyPublic, page, limit) => {
        const albumImages = await prisma.albumImages.findMany({
            where: {
                albumId,
                ...(onlyPublic ? { album: { visibility: "public" } } : {}),
            },
            include: { image: true, album: { include: { user: true } } },
            skip: (page - 1) * limit,
            take: limit,
        });

        return albumImages.map((ai) => mapToPhoto(ai, ai.album.userId));
    },

    delete: async (photoId) => {
        await prisma.albumImages.delete({ where: { id: photoId } });
    },

    findById: async (photoId) => {
        const found = await prisma.albumImages.findFirst({
            where: { id: photoId },
            include: { image: true, album: { include: { user: true } } },
        });
        if (!found) return null;
        return mapToPhoto(found, found.album.userId);
    },

    countByAlbum: async (albumId) => {
        const count = prisma.albumImages.count({ where: { albumId } });
        return count;
    },
};

function mapToPhoto(albumImage: any, userId: number) {
    const photo = {
        id: albumImage.id,
        albumId: albumImage.albumId,
        userId,
        photoName: albumImage.image.pathname ?? "",
        visibility: albumImage.album?.visibility ?? "private",
        createdAt: albumImage.image.uploaded_at,
        updatedAt: albumImage.image.uploaded_at,
    };
    return photo;
}
