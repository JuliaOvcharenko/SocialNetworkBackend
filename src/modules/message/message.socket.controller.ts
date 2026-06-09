import { MessageService } from "./message.service";
import { MessageSocketControllerContract } from "./types/message.contracts";

export const MessageSocketController: MessageSocketControllerContract = {
    registerHandlers(socketServer, socket) {
        socket.on("sendMessage", (data) => {
            this.sendMessage(socketServer, socket, data);
        });
    },

    async sendMessage(socketServer, socket, data) {
        console.log("sendMessage data:", JSON.stringify(data));
        try {
            const { text, chatId, imageUri } = data;

            const images: string[] = Array.isArray(imageUri)
                ? imageUri
                : imageUri
                  ? [imageUri]
                  : [];

            const newMessage = await MessageService.addMessage({
                text: text ?? null,
                chatId,
                createdAt: new Date(),
                senderId: socket.data.userId,
                ...(images.length > 0 && {
                    messageImages: {
                        create: images.map((image) => ({ image })),
                    },
                }),
            });

            const serialized = {
                ...newMessage,
                id: newMessage.id.toString(),
                chatId: newMessage.chatId.toString(),
                senderId: newMessage.senderId?.toString() ?? null,
                createdAt:
                    newMessage.createdAt instanceof Date
                        ? newMessage.createdAt.toISOString()
                        : newMessage.createdAt,
                sender: newMessage.sender
                    ? { ...newMessage.sender, id: newMessage.sender.id.toString() }
                    : null,
            };

            this.broadcastMessage(socketServer, serialized as any);
        } catch (error) {
            console.error("sendMessage error:", error);
        }
    },

    broadcastMessage(socketServer, message) {
        const room = `chat-${message.chatId}`;
        socketServer.in(room).emit("newMessage", message);
    },
};
