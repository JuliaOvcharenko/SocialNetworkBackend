import { prisma } from "../../prisma/client";
import { ChatRepositoryContract } from "./types/chat.contracts";
import { OnlineStatusManager } from "../socket/online.manager";

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

function mapChatWithOnlineStatus(chat: any) {
    if (!chat || !chat.users) return chat;

    return {
        ...chat,
        users: chat.users.map((chatUser: any) => {
            if (!chatUser.user) return chatUser;
            return {
                ...chatUser,
                user: {
                    ...chatUser.user,
                    isOnline: OnlineStatusManager.isUserOnline(Number(chatUser.user.id)),
                },
            };
        }),
    };
}

export const ChatRepository: ChatRepositoryContract = {
    getGroupChats: async (userId) => {
        const chats = await prisma.chat.findMany({
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
        return chats.map(mapChatWithOnlineStatus) as any;
    },

    getPersonalChats: async (userId) => {
        const chats = await prisma.chat.findMany({
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
        return chats.map(mapChatWithOnlineStatus) as any;
    },

    createChat: async (adminId, data, filename) => {
        const cleanAdminId = Number(adminId);
        const cleanUserIds = data.userIds.map(Number);
        const pureUserIds = cleanUserIds.filter((id) => id !== cleanAdminId);
        const allUniqueUserIds = Array.from(new Set([cleanAdminId, ...pureUserIds]));

        const chat = await prisma.chat.create({
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
        return mapChatWithOnlineStatus(chat) as any;
    },

    updateChat: async (chatId, data) => {
        const chat = await prisma.chat.update({
            where: { id: chatId },
            data,
            include: {
                users: {
                    select: chatUserSelect,
                },
            },
        });
        return mapChatWithOnlineStatus(chat) as any;
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
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                users: {
                    where: { NOT: { userId: BigInt(userId) } },
                    select: chatUserSelect,
                },
            },
        });
        return mapChatWithOnlineStatus(chat) as any;
    },

    getChatParticipants: async (chatId) => {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { users: { include: { user: true } } },
        });
        return mapChatWithOnlineStatus(chat) as any;
    },

    getChatByParticipants: async (userId, participantId) => {
        const chat = await prisma.chat.findFirst({
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
        return mapChatWithOnlineStatus(chat) as any;
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

        const chat = await prisma.chat.findUniqueOrThrow({
            where: { id: chatId },
            include: {
                users: {
                    select: chatUserSelect,
                },
            },
        });
        return mapChatWithOnlineStatus(chat) as any;
    },

    removeUserFromChat: async (chatId, userId) => {
        await prisma.chatUser.deleteMany({
            where: { chatId, userId: BigInt(userId) },
        });
    },
};