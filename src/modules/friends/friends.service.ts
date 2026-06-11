import { Friendship } from "../../../generated/prisma/client";
import { FriendsRepository } from "./friends.repository";
import { FriendsServiceContract } from "./types/friends.contracts";
import { FriendsOverview, FriendshipWithUsers, UserWithProfile } from "./types/friends.types";
import { OnlineStatusManager } from "../socket/online.manager"; 

function mapUserWithOnlineStatus(user: any) {
    if (!user) return user;
    return {
        ...user,
        isOnline: OnlineStatusManager.isUserOnline(Number(user.id))
    };
}

function mapFriendshipWithOnlineStatus(friendship: FriendshipWithUsers) {
    return {
        ...friendship,
        fromUser: mapUserWithOnlineStatus(friendship.fromUser),
        toUser: mapUserWithOnlineStatus(friendship.toUser),
    };
}

export const FriendsService: FriendsServiceContract = {
    async getRequests(userId: number): Promise<FriendshipWithUsers[]> {
        const requests = await FriendsRepository.getPendingRequests(userId);
        return requests.map(mapFriendshipWithOnlineStatus) as unknown as FriendshipWithUsers[];
    },

    async getSuggestions(userId: number): Promise<UserWithProfile[]> {
        const suggestions = await FriendsRepository.getSuggestions(userId, 10);
        return suggestions.map(mapUserWithOnlineStatus) as unknown as UserWithProfile[];
    },

    async getAllFriends(userId: number): Promise<FriendshipWithUsers[]> {
        const friends = await FriendsRepository.getAcceptedFriends(userId);
        return friends.map(mapFriendshipWithOnlineStatus) as unknown as FriendshipWithUsers[];
    },

    async getOverview(userId: number): Promise<FriendsOverview> {
        const [requests, friends, suggestions] = await Promise.all([
            FriendsRepository.getPendingRequests(userId),
            FriendsRepository.getAcceptedFriends(userId),
            FriendsRepository.getSuggestions(userId, 2),
        ]);
        
        return { 
            requests: requests.map(mapFriendshipWithOnlineStatus) as unknown as FriendshipWithUsers[], 
            suggestions: suggestions.map(mapUserWithOnlineStatus) as unknown as UserWithProfile[], 
            friends: friends.map(mapFriendshipWithOnlineStatus) as unknown as FriendshipWithUsers[] 
        };
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