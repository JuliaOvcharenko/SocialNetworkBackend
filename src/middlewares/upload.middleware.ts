import { NextFunction, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import { cloudinary } from "../config/cloudinary";

export const uploadMiddleware = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});

function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                format: "jpeg",
            },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            },
        );
        stream.end(buffer);
    });
}

export function processImageMiddleware(
    width: number,
    quality: number = 80,
    folder: string = "uploads",
) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;

            if (!file) {
                next();
                return;
            }

            const thumbnailBuffer = await sharp(file.buffer)
                .resize(width)
                .jpeg({ quality })
                .toBuffer();

            const url = await uploadBufferToCloudinary(thumbnailBuffer, folder);

            file.filename = url;

            next();
        } catch (error) {
            next(error);
        }
    };
}
