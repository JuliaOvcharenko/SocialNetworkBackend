import { Friendship, User, Profile } from "../../../../generated/prisma/client";

export type FriendshipStatus = "pending" | "accepted" | "rejected";

export type UserWithProfile = User & { profile: Profile | null };

export type FriendshipWithUsers = Friendship & {
    fromUser: UserWithProfile;
    toUser:   UserWithProfile;
};

export interface FriendsOverview {
    requests:    FriendshipWithUsers[];
    suggestions: UserWithProfile[];
    friends:     FriendshipWithUsers[];
}