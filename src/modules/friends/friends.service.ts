import { FriendsRepository } from "./friends.repository";

export const FriendsService = {
    async getRequests(userId: number) {
        return await FriendsRepository.getPendingRequests(userId);
    },

    async getSuggestions(userId: number) {
        return await FriendsRepository.getSuggestions(userId, 2);
    },

    async getAllFriends(userId: number) {
        return await FriendsRepository.getAcceptedFriends(userId);
    },

    async getOverview(userId: number) {
        const [requests, friends, suggestions] = await Promise.all([
            FriendsRepository.getPendingRequests(userId),
            FriendsRepository.getAcceptedFriends(userId),
            FriendsRepository.getSuggestions(userId, 2),
        ]);

        return { requests, suggestions, friends };
    },

    async sendRequest(currentUserId: number, targetUserId: number) {
        return await FriendsRepository.createFriendship(currentUserId, targetUserId, "pending");
    },

    async acceptAction(currentUserId: number, id: number, type?: string) {
        if (type === "request") {
            const updated = await FriendsRepository.updateFriendshipStatus(id, "accepted");
            return { message: "Запрос принят", data: updated };
        }

        if (type === "suggestion") {
            const request = await FriendsRepository.createFriendship(currentUserId, id, "pending");
            return { message: "Запрос отправлен", data: request };
        }

        throw new Error("Invalid type parameter");
    },

    async deleteAction(currentUserId: number, targetOrFriendshipId: number, type?: string) {
        if (type === "request") {
            await FriendsRepository.deleteFriendship(targetOrFriendshipId);
            return { message: "Запрос удален" };
        }

        if (type === "suggestion") {
            await FriendsRepository.createFriendship(currentUserId, targetOrFriendshipId, "ignored");
            return { message: "Рекомендация проигнорирована" };
        }

        await FriendsRepository.deleteFriendship(targetOrFriendshipId);
        return { message: "Пользователь удален из друзей" };
    }
};