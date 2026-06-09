import { ForbiddenError, NotFoundError } from "../../errors/app.errors";
import { ChatRepository } from "./chat.repository";
import { ChatServiceContract } from "./types/chat.contracts";

export const ChatService: ChatServiceContract = {
    getGroupChats: async (userId) => {
        return await ChatRepository.getGroupChats(userId);
    },

    getPersonalChats: async (userId) => {
        return await ChatRepository.getPersonalChats(userId);
    },

    createChat: async (adminId, data, filename) => {
        return await ChatRepository.createChat(adminId, data, filename);
    },

    updateChat: async (chatId, data) => {
        return await ChatRepository.updateChat(chatId, data);
    },

    deleteChat: async (chatId) => {
        await ChatRepository.deleteChat(chatId);
    },

    leaveChat: async (userId, chatId) => {
        await ChatRepository.leaveChat(userId, chatId);
    },

    findChatById: async (chatId, userId) => {
        return await ChatRepository.findChatById(chatId, userId);
    },

    isUserChatParticipant: async (chatId, userId) => {
        const chat = await ChatRepository.getChatParticipants(chatId);
        if (!chat) throw new NotFoundError("Chat");
        return chat.users.some((p) => p.userId === BigInt(userId));
    },

    getChatByParticipants: async (userId, participantId) => {
        return await ChatRepository.getChatByParticipants(userId, participantId);
    },

    addUsersToChat: async (chatId, adminId, userIds) => {
        const chat = await ChatRepository.getChatParticipants(chatId);
        if (!chat) throw new NotFoundError("Chat");
        if (!chat.isGroup) throw new ForbiddenError("Cannot add users to a personal chat");
        if (chat.adminId !== BigInt(adminId)) throw new ForbiddenError("Only admin can add users");
        return await ChatRepository.addUsersToChat(chatId, userIds);
    },

    removeUserFromChat: async (chatId, adminId, targetUserId) => {
        const chat = await ChatRepository.getChatParticipants(chatId);
        if (!chat) throw new NotFoundError("Chat");
        if (!chat.isGroup) throw new ForbiddenError("Cannot remove users from a personal chat");
        if (chat.adminId !== BigInt(adminId))
            throw new ForbiddenError("Only admin can remove users");
        if (targetUserId === adminId) throw new ForbiddenError("Admin cannot remove themselves");
        await ChatRepository.removeUserFromChat(chatId, targetUserId);
    },
};
