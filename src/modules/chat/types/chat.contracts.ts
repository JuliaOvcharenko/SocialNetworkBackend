import type { Request, Response } from "express";
import {
    ChatWithUsers,
    ChatWithUsersAndLastMessage,
    ChatWithParticipants,
    CreateGroupChatDto,
    ChatUpdateInput,
    JoinChatPayload,
    JoinChatCallback,
    LeaveChatPayload,
    AddUsersToChatPayload,
    RemoveUserFromChatPayload,
} from "./chat.types";
import { AuthenticatedSocket } from "../../socket/socket.types";
import { SendMessageDTO } from "../../message/types/message.types";

export interface ChatClientToServerEvents {
    joinChat: (data: JoinChatPayload, ack?: JoinChatCallback) => void;
    leaveChat: (data: LeaveChatPayload) => void;
    sendMessage: (data: SendMessageDTO) => void;
    addUsersToChat: (data: AddUsersToChatPayload, ack?: JoinChatCallback) => void;
    removeUserFromChat: (data: RemoveUserFromChatPayload, ack?: JoinChatCallback) => void;
    mark_read: (data: { chatId: number }) => void;
}

export interface ChatHttpController {
    getGroupChats: (
        req: Request<object, ChatWithUsersAndLastMessage[] | string, object>,
        res: Response<ChatWithUsersAndLastMessage[] | string>,
    ) => Promise<void>;

    getPersonalChats: (
        req: Request<object, ChatWithUsersAndLastMessage[] | string, object>,
        res: Response<ChatWithUsersAndLastMessage[] | string>,
    ) => Promise<void>;

    createChat: (
        req: Request<object, ChatWithUsers | string, CreateGroupChatDto>,
        res: Response<ChatWithUsers | string>,
    ) => Promise<void>;

    updateChat: (
        req: Request<{ id: string }, ChatWithUsers | string, ChatUpdateInput>,
        res: Response<ChatWithUsers | string>,
    ) => Promise<void>;

    deleteChat: (
        req: Request<{ id: string }, string, object>,
        res: Response<string>,
    ) => Promise<void>;

    leaveChat: (
        req: Request<object, string, { chatId: number }>,
        res: Response<string>,
    ) => Promise<void>;

    findChatById: (
        req: Request<{ chatId: string }, ChatWithUsers | string, object>,
        res: Response<ChatWithUsers | string>,
    ) => Promise<void>;
}

export interface ChatServiceContract {
    getGroupChats: (userId: number) => Promise<ChatWithUsersAndLastMessage[]>;
    getPersonalChats: (userId: number) => Promise<ChatWithUsersAndLastMessage[]>;
    createChat: (
        adminId: number,
        data: CreateGroupChatDto,
        filename: string | null,
    ) => Promise<ChatWithUsers>;
    updateChat: (chatId: number, data: ChatUpdateInput) => Promise<ChatWithUsers>;
    deleteChat: (chatId: number) => Promise<void>;
    leaveChat: (userId: number, chatId: number) => Promise<void>;
    findChatById: (chatId: number, userId: number) => Promise<ChatWithUsers | null>;
    isUserChatParticipant: (chatId: number, userId: number) => Promise<boolean>;
    getChatByParticipants: (userId: number, participantId: number) => Promise<ChatWithUsers | null>;
    addUsersToChat: (chatId: number, adminId: number, userIds: number[]) => Promise<ChatWithUsers>;
    removeUserFromChat: (chatId: number, adminId: number, targetUserId: number) => Promise<void>;
}

export interface ChatRepositoryContract {
    getGroupChats: (userId: number) => Promise<ChatWithUsersAndLastMessage[]>;
    getPersonalChats: (userId: number) => Promise<ChatWithUsersAndLastMessage[]>;
    createChat: (
        adminId: number,
        data: CreateGroupChatDto,
        filename: string | null,
    ) => Promise<ChatWithUsers>;
    updateChat: (chatId: number, data: ChatUpdateInput) => Promise<ChatWithUsers>;
    deleteChat: (chatId: number) => Promise<void>;
    leaveChat: (userId: number, chatId: number) => Promise<void>;
    findChatById: (chatId: number, userId: number) => Promise<ChatWithUsers | null>;
    getChatParticipants: (chatId: number) => Promise<ChatWithParticipants | null>;
    getChatByParticipants: (userId: number, participantId: number) => Promise<ChatWithUsers | null>;
    addUsersToChat: (chatId: number, userIds: number[]) => Promise<ChatWithUsers>;
    removeUserFromChat: (chatId: number, userId: number) => Promise<void>;
}

export interface IChatSocketController {
    registerHandlers: (socket: AuthenticatedSocket) => void;
    joinChat: (socket: AuthenticatedSocket, data: JoinChatPayload, ack?: JoinChatCallback) => void;
    leaveChat: (socket: AuthenticatedSocket, data: LeaveChatPayload) => void;
    addUsersToChat: (
        socket: AuthenticatedSocket,
        data: AddUsersToChatPayload,
        ack?: JoinChatCallback,
    ) => void;
    removeUserFromChat: (
        socket: AuthenticatedSocket,
        data: RemoveUserFromChatPayload,
        ack?: JoinChatCallback,
    ) => void;
    markAsRead: (socket: AuthenticatedSocket, data: { chatId: number }) => void;
}
