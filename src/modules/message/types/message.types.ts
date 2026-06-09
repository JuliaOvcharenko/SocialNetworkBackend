import { Prisma } from "../../../../generated/prisma/client";

export const messageInclude = {
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
        select: {
            userId: true,
        },
    },
};

export type MessagePayload = Prisma.MessageGetPayload<{
    include: typeof messageInclude;
}>;

export type MessageWithSender = MessagePayload;

export interface CreateMessageData {
    text: string | null;
    chatId: bigint | number;
    senderId: bigint | number;
    createdAt: Date;
    messageImages?: {
        create: { image: string }[];
    };
}

export interface SendMessageDTO {
    text: string | null;
    chatId: number;
    imageUri?: string | string[] | null;
}

export interface PaginatedMessages {
    data: MessageWithSender[];
    total: number;
    page: number;
    limit: number;
}
