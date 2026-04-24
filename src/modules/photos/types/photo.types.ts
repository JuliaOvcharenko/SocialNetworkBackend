/*
    ==================== PHOTOS ====================

    POST    /albums/:id/photos              Додати фото до альбому
                                            Body:   { photoName: string }
    Return: 201 + photo object
    ⛔ type: "system" — 403 Forbidden

    ⛔ 409 якщо перевищено ліміт


    PATCH   /albums/:id/photos/:photoId/visibility      Змінити видимість фото
                                                        Body:   { visibility: "public" | "private" | "friends" }
    Return: 200 + updated photo object
    ✅ system + custom

    GET     /albums/:id/photos                        Отримати фото альбому
                                                      Query:  { page?: number, limit?: number }
    Return: 200 + array of photos
    ✅ system + custom
    ⚠️ інший юзер — тільки visibility: "public"

    DELETE  /albums/:id/photos/:photoId               Видалити фото з альбому
                                                      Return: 204 No Content
    ✅ system + custom
*/

export type PhotoVisibility = "public" | "private";

export interface Photo {
    id: number;
    albumId: number;
    userId: number;
    photoName: string;
    visibility: PhotoVisibility;
    createdAt: Date;
    updatedAt: Date;
}

export type CreatePhoto = Pick<Photo, "photoName">;
export type UpdatePhotoVisibility = Pick<Photo, "visibility">;
