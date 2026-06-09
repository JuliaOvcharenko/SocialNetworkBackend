
export type PhotoVisibility = "public" | "private";

export interface Photo {
    id:         bigint;
    albumId:    bigint;
    userId:     bigint | null;
    photoName:  string;
    visibility: "public" | "private";
    createdAt:  Date;
}

export type CreatePhoto = Pick<Photo, "photoName">;
export type UpdatePhotoVisibility = Pick<Photo, "visibility">;
