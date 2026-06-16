import { Router } from "express";
import { ChatController } from "./chat.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { processImageMiddleware, uploadMiddleware } from "../../middlewares/upload.middleware";

export const chatRouter = Router();

chatRouter.get("/personal-chats", authenticateMiddleware, ChatController.getPersonalChats);
chatRouter.get("/group-chats", authenticateMiddleware, ChatController.getGroupChats);

chatRouter.post(
    "/",
    authenticateMiddleware,
    uploadMiddleware.single("avatar"),
    processImageMiddleware(800, 80, "chat-avatars"),
    ChatController.createChat,
);

chatRouter.patch(
    "/:id",
    authenticateMiddleware,
    uploadMiddleware.single("avatar"),
    processImageMiddleware(800, 80, "chat-avatars"),
    ChatController.updateChat,
);

chatRouter.patch("/:id", authenticateMiddleware, ChatController.updateChat);
chatRouter.delete("/:id", authenticateMiddleware, ChatController.deleteChat);
chatRouter.delete("/leave", authenticateMiddleware, ChatController.leaveChat);
chatRouter.get("/:chatId", authenticateMiddleware, ChatController.findChatById);
