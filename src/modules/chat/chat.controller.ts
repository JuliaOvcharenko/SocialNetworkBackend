import { ChatService } from "./chat.service";
import { ChatHttpController } from "./types/chat.contracts";
import { ChatUpdateInput } from "./types/chat.types";

export const ChatController: ChatHttpController = {
    getGroupChats: async (req, res) => {
        try {
            const chats = await ChatService.getGroupChats(res.locals.userId);
            res.status(200).json(chats);
        } catch {
            res.status(500).json("Internal Server Error");
        }
    },

    getPersonalChats: async (req, res) => {
        try {
            const chats = await ChatService.getPersonalChats(res.locals.userId);
            res.status(200).json(chats);
        } catch {
            res.status(500).json("Internal Server Error");
        }
    },

    createChat: async (req, res) => {
        try {
            const adminId = Number(res.locals.userId);
            const { name, userIds, isGroup } = req.body;

            let parsedUserIds: number[] = [];
            if (typeof userIds === "string") {
                try {
                    const raw = JSON.parse(userIds);
                    parsedUserIds = Array.isArray(raw) ? raw.map(Number) : [Number(userIds)];
                } catch {
                    parsedUserIds = [Number(userIds)];
                }
            } else if (Array.isArray(userIds)) {
                parsedUserIds = userIds.map(Number);
            } else if (userIds) {
                parsedUserIds = [Number(userIds)];
            }

            if (String(isGroup) !== "true" && parsedUserIds.length === 1) {
                const existing = await ChatService.getChatByParticipants(
                    adminId,
                    parsedUserIds[0]!,
                );
                if (existing) {
                    res.status(200).json(existing);
                    return;
                }
            }

            const files = req.files as Express.Multer.File[];
            const filename = files?.[0]?.filename ?? null;

            const chat = await ChatService.createChat(
                adminId,
                { name, userIds: parsedUserIds, isGroup: String(isGroup) === "true" },
                filename,
            );

            res.status(200).json(chat);
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    },

    updateChat: async (req, res) => {
        try {
            const files = req.files as Express.Multer.File[] | undefined;
            const file = req.file ?? files?.[0];
            const filename = file?.filename ?? null;

            const data: ChatUpdateInput = {};
            if (req.body.name) data.name = req.body.name;
            if (filename) data.avatar = filename;

            const chat = await ChatService.updateChat(Number(req.params.id), data);
            res.status(200).json(chat);
        } catch {
            res.status(500).json("Internal Server Error");
        }
    },

    deleteChat: async (req, res) => {
        try {
            await ChatService.deleteChat(Number(req.params.id));
            res.status(200).json("Chat deleted");
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    },

    leaveChat: async (req, res) => {
        try {
            const chatId = Number(req.body.chatId ?? req.query.chatId);
            await ChatService.leaveChat(res.locals.userId, chatId);
            res.status(200).json("Chat was left");
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    },

    findChatById: async (req, res) => {
        try {
            const chat = await ChatService.findChatById(
                Number(req.params.chatId),
                res.locals.userId,
            );
            if (!chat) {
                res.status(404).json("Chat not found");
                return;
            }
            res.status(200).json(chat);
        } catch {
            res.status(500).json("Internal Server Error");
        }
    },
};
