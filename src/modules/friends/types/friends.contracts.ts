import { Request, Response, NextFunction } from "express";
import { Friendship } from "../../../../generated/prisma/client";
import { FriendsOverview, FriendshipWithUsers, UserWithProfile } from "./friends.types";
import { LoginUser } from "../../user/types/user.types";

export interface FriendsRepositoryContract {
    getPendingRequests:  (userId: number) => Promise<FriendshipWithUsers[]>;
    getSuggestions:      (userId: number, limit?: number) => Promise<UserWithProfile[]>;
    getAcceptedFriends:  (userId: number) => Promise<FriendshipWithUsers[]>;
    createFriendRequest: (fromUserId: number, toUserId: number) => Promise<Friendship>;
    acceptRequest:       (requestId: number, userId: number) => Promise<Friendship>;
    deleteFriendRequest: (requestId: number, userId: number) => Promise<Friendship>;
    deleteFriend:        (friendshipId: number, userId: number) => Promise<Friendship>;
}

export interface FriendsServiceContract {
    getRequests:    (userId: number) => Promise<FriendshipWithUsers[]>;
    getSuggestions: (userId: number) => Promise<UserWithProfile[]>;
    getAllFriends:   (userId: number) => Promise<FriendshipWithUsers[]>;
    getOverview:    (userId: number) => Promise<FriendsOverview>;
    sendRequest:    (currentUserId: number, targetUserId: number) => Promise<Friendship>;
    acceptRequest:  (currentUserId: number, requestId: number) => Promise<{ message: string; data: Friendship }>;
    deleteRequest:  (currentUserId: number, requestId: number) => Promise<{ message: string }>;
    deleteFriend:   (currentUserId: number, friendshipId: number) => Promise<{ message: string }>;
}

export interface FriendsControllerContract {
    getRequests: (
        req: Request<object, FriendshipWithUsers[], object, object, LoginUser>,
        res: Response<FriendshipWithUsers[], LoginUser>,
        next: NextFunction,
    ) => void;

    getSuggestions: (
        req: Request<object, UserWithProfile[], object, object, LoginUser>,
        res: Response<UserWithProfile[], LoginUser>,
        next: NextFunction,
    ) => void;

    getAllFriends: (
        req: Request<object, FriendshipWithUsers[], object, object, LoginUser>,
        res: Response<FriendshipWithUsers[], LoginUser>,
        next: NextFunction,
    ) => void;

    getOverview: (
        req: Request<object, FriendsOverview, object, object, LoginUser>,
        res: Response<FriendsOverview, LoginUser>,
        next: NextFunction,
    ) => void;

    sendRequest: (
        req: Request<object, Friendship, { targetUserId: number }, object, LoginUser>,
        res: Response<Friendship, LoginUser>,
        next: NextFunction,
    ) => void;

    acceptRequest: (
        req: Request<{ id: string }, { message: string; data: Friendship }, object, object, LoginUser>,
        res: Response<{ message: string; data: Friendship }, LoginUser>,
        next: NextFunction,
    ) => void;

    deleteRequest: (
        req: Request<{ id: string }, { message: string }, object, object, LoginUser>,
        res: Response<{ message: string }, LoginUser>,
        next: NextFunction,
    ) => void;

    deleteFriend: (
        req: Request<{ id: string }, { message: string }, object, object, LoginUser>,
        res: Response<{ message: string }, LoginUser>,
        next: NextFunction,
    ) => void;
}