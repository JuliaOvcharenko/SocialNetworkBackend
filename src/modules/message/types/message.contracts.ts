import type { Request, Response } from "express";
import { AuthenticatedSocket, ServerSocket } from "../../socket/socket.types";
import {
    CreateMessageData,
    MessagePayload,
    MessageWithSender,
    SendMessageDTO,
} from "./message.types";

export interface MessageHttpControllerContract {
    fetchMessages: (
        req: Request<{ chatId: string }, MessagePayload[] | string, object>,
        res: Response<MessagePayload[] | string>,
    ) => void;
    uploadImage: (req: Request, res: Response) => void;
}

export interface MessageServiceContract {
    fetchMessages: (chatId: number) => Promise<MessagePayload[]>;
    fetchAllByChatId: (chatId: number) => Promise<MessagePayload[]>;
    addMessage: (data: CreateMessageData) => Promise<MessageWithSender>;
}

export interface MessageRepositoryContract {
    fetchMessages: (chatId: number) => Promise<MessagePayload[]>;
    fetchAllByChatId: (chatId: number) => Promise<MessagePayload[]>;
    addMessage: (data: CreateMessageData) => Promise<MessageWithSender>;
}

export interface MessageSocketControllerContract {
    registerHandlers: (server: ServerSocket, socket: AuthenticatedSocket) => void;
    sendMessage: (server: ServerSocket, socket: AuthenticatedSocket, data: SendMessageDTO) => void;
    broadcastMessage: (server: ServerSocket, message: MessageWithSender) => void;
}
