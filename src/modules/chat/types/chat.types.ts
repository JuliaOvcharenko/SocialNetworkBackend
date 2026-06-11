import { Prisma } from "../../../../generated/prisma/client";

export type ChatPayload = Prisma.ChatGetPayload<{}>;

const chatUserSelectShape = {
    select: {
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
    },
} as const;

const messageSelectShape = {
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

const unreadCountShape = {
    select: {
        messages: {
            where: {
                senderId: { not: BigInt(0) },
                chat_app_message_readers: {
                    none: { userId: BigInt(0) },
                },
            },
        },
    },
} as const;


export type ChatWithUsers = Omit<Prisma.ChatGetPayload<{
    include: { users: typeof chatUserSelectShape };
}>, "users"> & {
    users: Array<Prisma.ChatUserGetPayload<typeof chatUserSelectShape> & {
        user: { isOnline?: boolean };
    }>;
};

export type ChatWithUsersAndLastMessage = Omit<Prisma.ChatGetPayload<{
    include: {
        users: typeof chatUserSelectShape;
        messages: typeof messageSelectShape;
        _count: typeof unreadCountShape;
    };
}>, "users"> & {
    users: Array<Prisma.ChatUserGetPayload<typeof chatUserSelectShape> & {
        user: { isOnline?: boolean };
    }>;
};


export type ChatWithParticipants = Prisma.ChatGetPayload<{
    include: { users: true };
}>;

export type ChatCreateInput = Prisma.ChatUncheckedCreateInput;

export type ChatUpdateInput = {
    name?: string;
    avatar?: string;
};

export interface CreateGroupChatDto {
    name: string;
    userIds: number[];
    isGroup?: boolean;
}

export interface JoinChatPayload {
    chatId: number;
}
export interface LeaveChatPayload {
    chatId: number;
}
export interface AddUsersToChatPayload {
    chatId: number;
    userIds: number[];
}
export interface RemoveUserFromChatPayload {
    chatId: number;
    targetUserId: number;
}

export type JoinChatCallback = (
    response: { status: "ok" } | { status: "error"; message?: string },
) => void;