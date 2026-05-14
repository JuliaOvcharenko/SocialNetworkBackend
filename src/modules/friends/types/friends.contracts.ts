import { Request, Response, NextFunction } from "express";
import { Friendship, User } from "../../../../generated/prisma/client";
import { FriendsOverview, FriendshipWithProfile } from "./friends.types";
import { LoginUser } from "../../user/types/user.types";

export interface FriendsRepositoryContract {
    getPendingRequests: (userId: number) => Promise<FriendshipWithProfile[]>;
    getSuggestions: (userId: number, limit?: number) => Promise<User[]>;
    getAcceptedFriends: (userId: number) => Promise<FriendshipWithProfile[]>;
    createFriendship: (fromUserId: number, toUserId: number, status?: string) => Promise<Friendship>;
    updateFriendshipStatus: (id: number, status: string) => Promise<Friendship>;
    deleteFriendship: (id: number) => Promise<Friendship>;
}

export interface FriendsServiceContract {
    getRequests: (userId: number) => Promise<FriendshipWithProfile[]>;
    getSuggestions: (userId: number) => Promise<User[]>;
    getAllFriends: (userId: number) => Promise<FriendshipWithProfile[]>;
    getOverview: (userId: number) => Promise<FriendsOverview>;
    sendRequest: (currentUserId: number, targetUserId: number) => Promise<Friendship>;
    acceptAction: (currentUserId: number, id: number, type?: string) => Promise<{ message: string; data: Friendship }>;
    deleteAction: (currentUserId: number, id: number, type?: string) => Promise<{ message: string }>;
}

export interface FriendsControllerContract {
    getRequests: (
        req: Request<object, FriendshipWithProfile[], object, object, LoginUser>,
        res: Response<FriendshipWithProfile[], LoginUser>,
        next: NextFunction,
    ) => void;

    getSuggestions: (
        req: Request<object, User[], object, object, LoginUser>,
        res: Response<User[], LoginUser>,
        next: NextFunction,
    ) => void;

    getAllFriends: (
        req: Request<object, FriendshipWithProfile[], object, object, LoginUser>,
        res: Response<FriendshipWithProfile[], LoginUser>,
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

    acceptAction: (
        req: Request<{ id: string }, { message: string; data: Friendship }, object, { type?: string }, LoginUser>,
        res: Response<{ message: string; data: Friendship }, LoginUser>,
        next: NextFunction,
    ) => void;

    deleteAction: (
        req: Request<{ id: string }, { message: string }, object, { type?: string }, LoginUser>,
        res: Response<{ message: string }, LoginUser>,
        next: NextFunction,
    ) => void;
}