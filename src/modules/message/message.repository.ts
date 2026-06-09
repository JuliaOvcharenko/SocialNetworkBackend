import { prisma } from "../../prisma/client";
import { MessageRepositoryContract } from "./types/message.contracts";
import { messageInclude } from "./types/message.types";

const messageSelect = {
    sender: {
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profile: {
                select: {
                    id: true,
                    avatar: true,
                },
            },
        },
    },
    messageImages: true,
    chat_app_message_readers: {
        select: { userId: true },
    },
};

function normalizeMessage(msg: any) {
    return {
        ...msg,
        createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
    };
}

export const MessageRepository: MessageRepositoryContract = {
    fetchMessages: async (chatId) => {
        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
            include: messageSelect,
        });
        return messages.map(normalizeMessage);
    },

    fetchAllByChatId: async (chatId) => {
        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
            include: messageInclude,
        });
        return messages.map(normalizeMessage);
    },

    addMessage: async (data) => {
        const message = await prisma.message.create({
            data,
            include: messageSelect,
        });
        return normalizeMessage(message);
    },
};
