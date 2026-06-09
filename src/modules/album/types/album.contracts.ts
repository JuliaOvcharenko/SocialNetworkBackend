import { Request, Response, NextFunction } from "express";
import { Album, AlbumWithProfile, CreateAlbum, UpdateAlbum } from "./album.types";
import { LoginUser } from "../../user/types/user.types";

export interface AlbumRepositoryContract {
    create:   (profileId: bigint, data: CreateAlbum) => Promise<Album>;
    edit:     (id: bigint, data: UpdateAlbum) => Promise<Album>;
    getAll:   (profileId: bigint) => Promise<Album[]>;
    delete:   (id: bigint) => Promise<void>;
    findById: (id: bigint) => Promise<AlbumWithProfile | null>;
}

export interface AlbumServiceContract {
    create: (userId: number, data: CreateAlbum) => Promise<Album>;
    edit:   (userId: number, albumId: number, data: UpdateAlbum) => Promise<Album>;
    getAll: (userId: number) => Promise<Album[]>;
    delete: (userId: number, albumId: number) => Promise<void>;
}

export interface AlbumControllerContract {
    create: (
        req: Request<object, Album, CreateAlbum, object, LoginUser>,
        res: Response<Album, LoginUser>,
        next: NextFunction,
    ) => void;
    edit: (
        req: Request<{ id: string }, Album, UpdateAlbum, object, LoginUser>,
        res: Response<Album, LoginUser>,
        next: NextFunction,
    ) => void;
    getAll: (
        req: Request<object, Album[], object, { userId: string }, LoginUser>,
        res: Response<Album[], LoginUser>,
        next: NextFunction,
    ) => void;
    delete: (
        req: Request<{ id: string }, void, object, object, LoginUser>,
        res: Response<void, LoginUser>,
        next: NextFunction,
    ) => void;
}