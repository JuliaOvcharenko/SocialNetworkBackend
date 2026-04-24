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
                                            Query:  { userId: string }
    Return: 200 + array of albums
    ✅ system + custom


    DELETE  /albums/:id                               Видалити альбом
    Return: 204 No Content
    ⛔ type: "system" — 403 Forbidden

*/

import { AlbumVisibility, AlbumType } from "../../../../generated/prisma/enums"

export interface Album {
    id:         number;
    userId:     number;
    name:       string;
    tag:        string | null;
    year:       number | null;
    visibility: AlbumVisibility;
    type:       AlbumType;
    createdAt:  Date;
    updatedAt:  Date;
}

export type CreateAlbum = Pick<Album, "name" | "tag" | "year" | "visibility">;

export type UpdateAlbum = Partial<Pick<Album, "name" | "tag" | "year">>;

export type UpdateAlbumVisibility = Pick<Album, "visibility">;