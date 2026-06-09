import { Prisma } from "../../../../generated/prisma/client";

export type Album = Prisma.AlbumGetPayload<{
    include: { images: true };
}>;

export type AlbumWithProfile = Prisma.AlbumGetPayload<{
    include: { images: true; profile: true };
}>;

export type AlbumImage = Prisma.AlbumImageGetPayload<{}>;

export type CreateAlbum = Pick<Album, "name" | "theme" | "year" | "isShown">;
export type UpdateAlbum = Partial<Pick<Album, "name" | "theme" | "year">>;