import { Router } from "express";
import { MessageController } from "./message.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { processImageMiddleware, uploadMiddleware } from "../../middlewares/upload.middleware";

export const messageRouter = Router()

messageRouter.post(
    "/upload",
    authenticateMiddleware,
    uploadMiddleware.single("file"),
    processImageMiddleware(800, 80, "chats"),
    MessageController.uploadImage
);

messageRouter.get('/:chatId', authenticateMiddleware, MessageController.fetchMessages)
