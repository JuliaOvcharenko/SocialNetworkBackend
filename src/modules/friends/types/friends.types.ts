import { Friendship, User } from "../../../../generated/prisma/client";


export type FriendshipWithProfile = Friendship & {
  fromProfileRel?: User;
  toProfileRel?: User;
};

export interface FriendsOverview {
  requests: FriendshipWithProfile[];
  suggestions: User[];
  friends: FriendshipWithProfile[];
}