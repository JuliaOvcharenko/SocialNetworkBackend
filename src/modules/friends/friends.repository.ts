import { prisma } from "../../prisma/client";
import { FriendsRepositoryContract } from "./types/friends.contracts";

const toId = (id: string | number) => BigInt(id);

const userWithProfile = { include: { profile: true } };

const STATUS = {
    pending: "pending",
    accepted: "accepted",
    rejected: "rejected",
} as const;

type FriendshipStatus = (typeof STATUS)[keyof typeof STATUS];

export const FriendsRepository: FriendsRepositoryContract = {
    async getPendingRequests(userId) {
        return prisma.friendship.findMany({
            where: {
                to_user_id: toId(userId),
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
                id: { not: toId(userId) },
                sentFriendships: {
                    none: { to_user_id: toId(userId) },
                },
                receivedFriendships: {
                    none: { from_user_id: toId(userId) },
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
                    { from_user_id: toId(userId), status: STATUS.accepted },
                    { to_user_id: toId(userId), status: STATUS.accepted },
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

        try {
            return await prisma.friendship.create({
                data: {
                    from_user_id: toId(fromUserId),
                    to_user_id: toId(toUserId),
                    status: STATUS.pending,
                    created_at: new Date(),
                },
            });
        } catch (e: any) {
            if (e.code === "P2002") throw new Error("Friendship already exists");
            throw e;
        }
    },

    async acceptRequest(requestId, userId) {
        return prisma.friendship.update({
            where: {
                id: toId(requestId),
                to_user_id: toId(userId),
            },
            data: { status: STATUS.accepted },
        });
    },

    async deleteFriendRequest(requestId, userId) {
        return prisma.friendship.delete({
            where: {
                id: toId(requestId),
                to_user_id: toId(userId),
            },
        });
    },

    async deleteFriend(friendshipId, userId) {
        const record = await prisma.friendship.findFirst({
            where: {
                id: toId(friendshipId),
                OR: [{ from_user_id: toId(userId) }, { to_user_id: toId(userId) }],
            },
        });

        if (!record) throw new Error("Friendship not found or access denied");

        return prisma.friendship.delete({ where: { id: toId(friendshipId) } });
    },
};
