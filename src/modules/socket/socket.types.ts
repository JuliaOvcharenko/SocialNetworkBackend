import { Server } from "http";
import type { DefaultEventsMap, Socket, Server as SocketServer } from "socket.io";
import type { ChatClientToServerEvents } from "../chat/types/chat.contracts";
import type { ChatWithUsers } from "../chat/types/chat.types";

export interface SocketManagerContract {
    socketServer: SocketServer | null;
    initSocketServer: (httpServer: Server) => void;
}

export type ServerEvents = DefaultEventsMap & {
    chatUpdated: (chat: ChatWithUsers) => void;
    userRemovedFromChat: (data: { chatId: number; userId: number }) => void;
};

export interface DataSocket {
    userId: number;
}

export type AuthenticatedSocket = Socket<ChatClientToServerEvents, ServerEvents, {}, DataSocket>;

export type ServerSocket = SocketServer<ChatClientToServerEvents, ServerEvents, {}, DataSocket>;
