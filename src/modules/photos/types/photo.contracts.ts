import { Request, Response, NextFunction } from "express";
import { LoginUser } from "../../user/types/user.types";
import { CreatePhoto, Photo, UpdatePhotoVisibility } from "./photo.types";


export interface PhotoRepositoryContract {
    create:             (albumId: bigint, userId: bigint, data: CreatePhoto) => Promise<Photo>;
    updateVisibility:   (photoId: bigint, data: UpdatePhotoVisibility) => Promise<Photo>;
    getAll:             (albumId: bigint, onlyPublic: boolean, page: number, limit: number) => Promise<Photo[]>;
    delete:             (photoId: bigint) => Promise<void>;
    findById:           (photoId: bigint) => Promise<Photo | null>;
    countByAlbum:       (albumId: bigint) => Promise<number>;
}

export interface PhotoServiceContract {
    create: (userId: number, albumId: number, data: CreatePhoto) => Promise<Photo>;
    updateVisibility: (
        userId: number,
        albumId: number,
        photoId: number,
        data: UpdatePhotoVisibility,
    ) => Promise<Photo>;
    getAll: (
        userId: number,
        albumId: number,
        requesterId: number,
        page: number,
        limit: number,
    ) => Promise<Photo[]>;
    delete: (userId: number, albumId: number, photoId: number) => Promise<void>;
}

export interface PhotoControllerContract {
    create: (
        req: Request<{ id: string }, Photo, CreatePhoto, object, LoginUser>,
        res: Response<Photo, LoginUser>,
        next: NextFunction,
    ) => void;

    updateVisibility: (
        req: Request<
            { id: string; photoId: string },
            Photo,
            UpdatePhotoVisibility,
            object,
            LoginUser
        >,
        res: Response<Photo, LoginUser>,
        next: NextFunction,
    ) => void;

    getAll: (
        req: Request<{ id: string }, Photo[], object, { page?: string; limit?: string }, LoginUser>,
        res: Response<Photo[], LoginUser>,
        next: NextFunction,
    ) => void;

    delete: (
        req: Request<{ id: string; photoId: string }, void, object, object, LoginUser>,
        res: Response<void, LoginUser>,
        next: NextFunction,
    ) => void;
}
