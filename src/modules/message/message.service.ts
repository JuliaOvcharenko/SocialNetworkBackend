import { MessageRepository } from "./message.repository";
import { MessageServiceContract } from "./types/message.contracts";

export const MessageService: MessageServiceContract = {
    fetchMessages: async (chatId) => {
        return await MessageRepository.fetchMessages(chatId);
    },

    fetchAllByChatId: async (chatId) => {
        return await MessageRepository.fetchAllByChatId(chatId);
    },

    addMessage: async (data) => {
        return await MessageRepository.addMessage(data);
    }
};