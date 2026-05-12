/*
    ==================== ALBUMS ====================

    POST    /albums                         Створити альбом (тільки кастомний)
                                            Body:   { name: string, tag: string, year: number, visibility: "public" | "private" }
    Return: 201 + album object
    ⛔ type: "system" — 403 Forbidden


    PATCH   /albums/:id                     Редагувати альбом
                                            Body:   { name?: string, tag?: string, year?: number }
    Return: 200 + updated album object
    ⛔ type: "system" — 403 Forbidden


    PATCH   /albums/:id/visibility          Змінити видимість альбому
                                            Body:   { visibility: "public" | "private"}
    Return: 200 + updated album object
    ⛔ type: "system" — 403 Forbidden


    GET     /albums                         Отримати всі альбоми користувача
                                            Query:  { userId: number }
    Return: 200 + array of albums
    ✅ system + custom


    DELETE  /albums/:id                               Видалити альбом
    Return: 204 No Content
    ⛔ type: "system" — 403 Forbidden

*/

import { Request, Response, NextFunction } from "express";
import { Album, CreateAlbum, UpdateAlbum, UpdateAlbumVisibility } from "./album.types";
import { LoginUser } from "../../user/types/user.types";

export interface AlbumRepositoryContract {
    create: (userId: number, data: CreateAlbum) => Promise<Album>;
    edit: (id: number, data: UpdateAlbum) => Promise<Album>;
    editVisibility: (id: number, data: UpdateAlbumVisibility) => Promise<Album>;
    getAll: (userId: number) => Promise<Album[]>;
    delete: (id: number) => Promise<void>;
    findById: (id: number) => Promise<Album | null>;
}

export interface AlbumServiceContract {
    create: (userId: number, data: CreateAlbum) => Promise<Album>;
    edit: (userId: number, albumId: number, data: UpdateAlbum) => Promise<Album>;
    editVisibility: (
        userId: number,
        albumId: number,
        data: UpdateAlbumVisibility,
    ) => Promise<Album>;
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

    editVisibility: (
        req: Request<{ id: string }, Album, UpdateAlbumVisibility, object, LoginUser>,
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
