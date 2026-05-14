import { Friendship, User } from "../../../generated/prisma/client";
import { FriendsRepository } from "./friends.repository";
import { FriendsServiceContract } from "./types/friends.contracts";
import { FriendsOverview, FriendshipWithProfile } from "./types/friends.types";

export const FriendsService: FriendsServiceContract = {
    async getRequests(userId: number): Promise<FriendshipWithProfile[]> {
        return await FriendsRepository.getPendingRequests(userId);
    },

    async getSuggestions(userId: number): Promise<User[]> {
        return await FriendsRepository.getSuggestions(userId, 2);
    },

    async getAllFriends(userId: number): Promise<FriendshipWithProfile[]> {
        return await FriendsRepository.getAcceptedFriends(userId);
    },

    async getOverview(userId: number): Promise<FriendsOverview> {
        const [requests, friends, suggestions] = await Promise.all([
            FriendsRepository.getPendingRequests(userId),
            FriendsRepository.getAcceptedFriends(userId),
            FriendsRepository.getSuggestions(userId, 2),
        ]);

        return { requests, suggestions, friends };
    },

    async sendRequest(currentUserId: number, targetUserId: number): Promise<Friendship> {
        return await FriendsRepository.createFriendship(currentUserId, targetUserId, "pending");
    },

    async acceptAction(currentUserId: number, id: number, type?: string): Promise<{ message: string; data: Friendship }> {
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

    async deleteAction(currentUserId: number, targetOrFriendshipId: number, type?: string): Promise<{ message: string }> {
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