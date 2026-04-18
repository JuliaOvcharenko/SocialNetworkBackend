import { NextFunction, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { BadRequestError } from "../errors/app.errors";
import { join } from "node:path";
import sharp from "sharp";
import { originalFiles, shakalFiles } from "../config/path";


export const uploadMiddleware = multer({
	storage: memoryStorage(),
	limits: {
		fileSize: 20 * 1024 * 1024,
	}
});
export function processImageMiddleware(width: number, quality: number = 80) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const file = req.file;
			if (!file) {
				next(new BadRequestError("No uploaded image!"));
				return;
			}
			const filename = `${Date.now()}.jpeg`;
			const originalFilePath = join(originalFiles, filename);
			const shakalFilePath = join(shakalFiles, filename);

			await sharp(file.buffer)
				.jpeg({ quality: 100, mozjpeg: true }) 
				.toFile(originalFilePath);

			await sharp(file.buffer)
				.resize(width) 
				.jpeg({ quality })
				.toFile(shakalFilePath);
			file.filename = filename;

			next();
		} catch (error) {
			next(error);
		}
	};
}