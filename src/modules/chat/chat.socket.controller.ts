import { prisma } from "../../prisma/client";
import { ChatService } from "./chat.service";
import type { IChatSocketController } from "./types/chat.contracts";

export const ChatSocketController: IChatSocketController = {
    registerHandlers(socket) {
        socket.on("joinChat", (data, ack) => {
            this.joinChat(socket, data, ack);
        });

        socket.on("leaveChat", (data) => {
            this.leaveChat(socket, data);
        });

        socket.on("addUsersToChat", (data, ack) => {
            this.addUsersToChat(socket, data, ack);
        });

        socket.on("removeUserFromChat", (data, ack) => {
            this.removeUserFromChat(socket, data, ack);
        });

        socket.on("mark_read", (data: { chatId: number }) => {
            this.markAsRead(socket, data);
        });
    },

    async markAsRead(socket, data) {
        try {
            const userId = socket.data.userId;
            const chatId = BigInt(data.chatId);

            const unread = await prisma.message.findMany({
                where: {
                    chatId,
                    senderId: { not: BigInt(userId) },
                    chat_app_message_readers: {
                        none: { userId: BigInt(userId) },
                    },
                },
                select: { id: true },
            });

            if (unread.length === 0) return;

            await prisma.messageReader.createMany({
                data: unread.map((msg) => ({
                    message_id: msg.id,
                    userId: BigInt(userId),
                })),
                skipDuplicates: true,
            });

            socket.to(`chat-${data.chatId}`).emit("messagesRead", { chatId: data.chatId });
            socket.emit("messagesRead", { chatId: data.chatId });
        } catch (error) {
            console.error("mark_read error:", error);
        }
    },

    async joinChat(socket, data, ack) {
        try {
            const isParticipant = await ChatService.isUserChatParticipant(
                data.chatId,
                socket.data.userId,
            );

            if (isParticipant) {
                await socket.join(`chat-${data.chatId}`);
                ack?.({ status: "ok" });
            } else {
                ack?.({ status: "error", message: "you are not chat participant" });
            }
        } catch {
            ack?.({ status: "error", message: "unknown error" });
        }
    },

    leaveChat(socket, data) {
        socket.leave(`chat-${data.chatId}`);
    },

    async addUsersToChat(socket, data, ack) {
        try {
            const updatedChat = await ChatService.addUsersToChat(
                data.chatId,
                socket.data.userId,
                data.userIds,
            );
            ack?.({ status: "ok" });
            socket.to(`chat-${data.chatId}`).emit("chatUpdated", updatedChat);
        } catch (error) {
            const message = error instanceof Error ? error.message : "unknown error";
            ack?.({ status: "error", message });
        }
    },

    async removeUserFromChat(socket, data, ack) {
        try {
            await ChatService.removeUserFromChat(
                data.chatId,
                socket.data.userId,
                data.targetUserId,
            );
            ack?.({ status: "ok" });
            socket.to(`chat-${data.chatId}`).emit("userRemovedFromChat", {
                chatId: data.chatId,
                userId: data.targetUserId,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "unknown error";
            ack?.({ status: "error", message });
        }
    },
};
