import { Friendship } from "../../../generated/prisma/client";
import { FriendsRepository } from "./friends.repository";
import { FriendsServiceContract } from "./types/friends.contracts";
import { FriendsOverview, FriendshipWithUsers, UserWithProfile } from "./types/friends.types";

export const FriendsService: FriendsServiceContract = {
    async getRequests(userId: number): Promise<FriendshipWithUsers[]> {
        return FriendsRepository.getPendingRequests(userId);
    },

    async getSuggestions(userId: number): Promise<UserWithProfile[]> {
        return FriendsRepository.getSuggestions(userId, 10);
    },

    async getAllFriends(userId: number): Promise<FriendshipWithUsers[]> {
        return FriendsRepository.getAcceptedFriends(userId);
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
        return FriendsRepository.createFriendRequest(currentUserId, targetUserId);
    },

    async acceptRequest(
        currentUserId: number,
        requestId: number,
    ): Promise<{ message: string; data: Friendship }> {
        const data = await FriendsRepository.acceptRequest(requestId, currentUserId);
        return { message: "Accepted", data };
    },

    async deleteRequest(currentUserId: number, requestId: number): Promise<{ message: string }> {
        await FriendsRepository.deleteFriendRequest(requestId, currentUserId);
        return { message: "Deleted" };
    },

    async deleteFriend(currentUserId: number, friendshipId: number): Promise<{ message: string }> {
        await FriendsRepository.deleteFriend(friendshipId, currentUserId);
        return { message: "Deleted" };
    },
};
