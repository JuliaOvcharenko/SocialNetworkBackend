import { prisma } from "../../prisma/client";
import { AlbumRepositoryContract } from "./types/album.contracts";
import { Album, CreateAlbum, UpdateAlbum, UpdateAlbumVisibility } from "./types/album.types";

export const AlbumRepository: AlbumRepositoryContract = {

    async create(userId: number, data: CreateAlbum): Promise<Album> {
        const createAlbum = await prisma.album.create({
            data: {
                ...data,
                userId,
                type: "custom",
            },
        });
        return createAlbum;
    },

    async edit(id: number, data: UpdateAlbum): Promise<Album> {
        const editAlbum = await prisma.album.update({
            where: { id },
            data,
        });
        return editAlbum;
    },

    async editVisibility(id: number, data: UpdateAlbumVisibility): Promise<Album> {
        const editAlbumVisibility = await prisma.album.update({
            where: { id },
            data,
        });
        return editAlbumVisibility;
    },

    async getAll(userId: number): Promise<Album[]> {
        const albums = await prisma.album.findMany({
            where: { userId },
        });
        return albums;
    },

    async delete(id: number): Promise<void> {
        await prisma.album.delete({
            where: { id },
        });
    },

    async findById(id: number): Promise<Album | null> {
        const album = await prisma.album.findUnique({
            where: { id },
        });
        return album;
    },

};