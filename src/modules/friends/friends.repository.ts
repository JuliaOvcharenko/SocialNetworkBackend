import { prisma } from "../../prisma/client";
import { FriendsRepositoryContract } from "./types/friends.contracts";

const userWithProfile = {
    include: { profile: true },
};

const STATUS = {
    pending: "pending",
    accepted: "accepted",
    rejected: "rejected",
};

export const FriendsRepository: FriendsRepositoryContract = {
    async getPendingRequests(userId) {
        return prisma.friendship.findMany({
            where: {
                to_user_id: BigInt(userId),
                status: STATUS.pending,
            },
            include: {
                fromUser: userWithProfile,
                toUser: userWithProfile,
            },
        });
    },

    async getSuggestions(userId, limit = 10) {
        return prisma.user.findMany({
            where: {
                id: { not: BigInt(userId) },
                sentFriendships: {
                    none: { to_user_id: BigInt(userId) },
                },
                receivedFriendships: {
                    none: { from_user_id: BigInt(userId) },
                },
            },
            include: { profile: true },
            take: limit,
        });
    },

    async getAcceptedFriends(userId) {
        return prisma.friendship.findMany({
            where: {
                OR: [
                    { from_user_id: BigInt(userId), status: STATUS.accepted },
                    { to_user_id: BigInt(userId), status: STATUS.accepted },
                ],
            },
            include: {
                fromUser: userWithProfile,
                toUser: userWithProfile,
            },
        });
    },

    async createFriendRequest(fromUserId, toUserId) {
        if (fromUserId === toUserId) {
            throw new Error("Cannot send friend request to yourself");
        }

        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { from_user_id: BigInt(fromUserId), to_user_id: BigInt(toUserId) },
                    { from_user_id: BigInt(toUserId), to_user_id: BigInt(fromUserId) },
                ],
            },
        });

        if (existing) {
            throw new Error("Friendship already exists");
        }

        return prisma.friendship.create({
            data: {
                from_user_id: BigInt(fromUserId),
                to_user_id: BigInt(toUserId),
                status: STATUS.pending,
                created_at: new Date(),
            },
        });
    },

    async acceptRequest(requestId, userId) {
        return prisma.friendship.update({
            where: {
                id: BigInt(requestId),
                to_user_id: BigInt(userId),
            },
            data: { status: STATUS.accepted },
        });
    },

    async deleteFriendRequest(requestId, userId) {
        return prisma.friendship.delete({
            where: {
                id: BigInt(requestId),
                to_user_id: BigInt(userId),
            },
        });
    },

    async deleteFriend(friendshipId, userId) {
        return prisma.friendship.delete({
            where: {
                id: BigInt(friendshipId),
                OR: [{ from_user_id: BigInt(userId) }, { to_user_id: BigInt(userId) }],
            },
        });
    },
};
