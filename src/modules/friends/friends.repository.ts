import { prisma } from "../../prisma/client";

export const FriendsRepository = {
    getPendingRequests(userId: number) {
        return prisma.friendship.findMany({
            where: { to_profile: userId, status: "pending" },
            include: { fromProfileRel: true },
        });
    },

    getSuggestions(userId: number, limit: number = 2) {
        return prisma.user.findMany({
            where: {
                id: { not: userId },
                sentRequests: { none: { to_profile: userId } },
                receivedRequests: { none: { from_profile: userId } },
            },
            take: limit,
        });
    },

    getAcceptedFriends(userId: number) {
        return prisma.friendship.findMany({
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

    createFriendship(fromUserId: number, toUserId: number, status: string = "pending") {
        return prisma.friendship.create({
            data: {
                from_profile: fromUserId,
                to_profile: toUserId,
                status,
            },
        });
    },

    updateFriendshipStatus(id: number, status: string) {
        return prisma.friendship.update({
            where: { id },
            data: { status },
        });
    },

    deleteFriendship(id: number) {
        return prisma.friendship.delete({
            where: { id },
        });
    },
};