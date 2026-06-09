import { prisma } from "../../prisma/client";
import { ChatRepositoryContract } from "./types/chat.contracts";

const chatUserSelect = {
    id: true,
    chatId: true,
    userId: true,
    user: {
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profile: {
                select: { id: true, avatar: true, pseudonym: true },
            },
        },
    },
} as const;

const messageSelect = {
    take: 1,
    orderBy: { createdAt: "desc" },
    select: {
        id: true,
        text: true,
        createdAt: true,
        senderId: true,
        sender: { select: { username: true } },
        chat_app_message_readers: { select: { userId: true } },
        messageImages: { select: { id: true, image: true } },
    },
} as const;

const buildUnreadCount = (userId: number) => ({
    select: {
        messages: {
            where: {
                senderId: { not: BigInt(userId) },
                chat_app_message_readers: {
                    none: { userId: BigInt(userId) },
                },
            },
        },
    },
});

export const ChatRepository: ChatRepositoryContract = {
    getGroupChats: async (userId) => {
        return await prisma.chat.findMany({
            where: {
                users: { some: { userId } },
                isGroup: true,
            },
            include: {
                users: {
                    where: { NOT: { userId } },
                    select: chatUserSelect,
                },
                messages: messageSelect,
                _count: buildUnreadCount(userId),
            },
        });
    },

    getPersonalChats: async (userId) => {
        return await prisma.chat.findMany({
            where: {
                users: { some: { userId } },
                isGroup: false,
            },
            include: {
                users: {
                    where: { NOT: { userId } },
                    select: chatUserSelect,
                },
                messages: messageSelect,
                _count: buildUnreadCount(userId),
            },
        });
    },

    createChat: async (adminId, data, filename) => {
        const cleanAdminId = Number(adminId);
        const cleanUserIds = data.userIds.map(Number);
        const pureUserIds = cleanUserIds.filter((id) => id !== cleanAdminId);
        const allUniqueUserIds = Array.from(new Set([cleanAdminId, ...pureUserIds]));

        return await prisma.chat.create({
            data: {
                name: data.name,
                isGroup: data.isGroup ?? false,
                avatar: filename ?? "default-group-avatar.png",
                adminId: cleanAdminId,
                users: {
                    create: allUniqueUserIds.map((id) => ({
                        user: { connect: { id: BigInt(id) } },
                    })),
                },
            },
            include: {
                users: {
                    where: { NOT: { userId: cleanAdminId } },
                    select: chatUserSelect,
                },
            },
        });
    },

    updateChat: async (chatId, data) => {
        return await prisma.chat.update({
            where: { id: chatId },
            data,
            include: {
                users: {
                    select: chatUserSelect,
                },
            },
        });
    },

    deleteChat: async (chatId) => {
        await prisma.$transaction([
            prisma.messageImage.deleteMany({ where: { message: { chatId } } }),
            prisma.message.deleteMany({ where: { chatId } }),
            prisma.chatUser.deleteMany({ where: { chatId } }),
            prisma.chat.delete({ where: { id: chatId } }),
        ]);
    },

    leaveChat: async (userId, chatId) => {
        await prisma.chatUser.deleteMany({ where: { userId, chatId } });
    },

    findChatById: async (chatId, userId) => {
        return await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                users: {
                    where: { NOT: { userId: BigInt(userId) } },
                    select: chatUserSelect,
                },
            },
        });
    },

    getChatParticipants: async (chatId) => {
        return await prisma.chat.findUnique({
            where: { id: chatId },
            include: { users: true },
        });
    },

    getChatByParticipants: async (userId, participantId) => {
        return await prisma.chat.findFirst({
            where: {
                isGroup: false,
                AND: [
                    { users: { some: { userId: BigInt(userId) } } },
                    { users: { some: { userId: BigInt(participantId) } } },
                ],
            },
            include: {
                users: {
                    where: { NOT: { userId: BigInt(userId) } },
                    select: chatUserSelect,
                },
            },
        });
    },

    addUsersToChat: async (chatId, userIds) => {
        const existing = await prisma.chatUser.findMany({
            where: { chatId },
            select: { userId: true },
        });

        const existingIds = new Set(existing.map((u) => u.userId.toString()));
        const newUserIds = userIds.filter((id) => !existingIds.has(String(id)));

        if (newUserIds.length > 0) {
            await prisma.chatUser.createMany({
                data: newUserIds.map((id) => ({
                    chatId,
                    userId: BigInt(id),
                })),
            });
        }

        return await prisma.chat.findUniqueOrThrow({
            where: { id: chatId },
            include: {
                users: {
                    select: chatUserSelect,
                },
            },
        });
    },

    removeUserFromChat: async (chatId, userId) => {
        await prisma.chatUser.deleteMany({
            where: { chatId, userId: BigInt(userId) },
        });
    },
};
