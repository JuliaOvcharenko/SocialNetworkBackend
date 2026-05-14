import { Friendship, User } from "../../../generated/prisma/client";
import { prisma } from "../../prisma/client";
import { FriendsRepositoryContract } from "./types/friends.contracts";
import { FriendshipWithProfile } from "./types/friends.types";

export const FriendsRepository: FriendsRepositoryContract = {
    async getPendingRequests(userId: number): Promise<FriendshipWithProfile[]> {
        return await prisma.friendship.findMany({
            where: { to_profile: userId, status: "pending" },
            include: { fromProfileRel: true },
        });
    },

    async getSuggestions(userId: number, limit: number = 2): Promise<User[]> {
        return await prisma.user.findMany({
            where: {
                id: { not: userId },
                sentRequests: { none: { to_profile: userId } },
                receivedRequests: { none: { from_profile: userId } },
            },
            take: limit,
        });
    },

    async getAcceptedFriends(userId: number): Promise<FriendshipWithProfile[]> {
        return await prisma.friendship.findMany({
            where: {
                OR: [{ from_profile: userId }, { to_profile: userId }],
                status: "accepted",
            },
            include: {
                fromProfileRel: true,
                toProfileRel: true,
            },
        });
    },

    async createFriendship(fromUserId: number, toUserId: number, status: string = "pending"): Promise<Friendship> {
        return await prisma.friendship.create({
            data: {
                from_profile: fromUserId,
                to_profile: toUserId,
                status,
            },
        });
    },

    async updateFriendshipStatus(id: number, status: string): Promise<Friendship> {
        return await prisma.friendship.update({
            where: { id },
            data: { status },
        });
    },

    async deleteFriendship(id: number): Promise<Friendship> {
        return await prisma.friendship.delete({
            where: { id },
        });
    },
};