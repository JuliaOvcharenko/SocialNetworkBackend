import { NextFunction, Request, Response } from "express";
import { FriendsService } from "./friends.service";
import { FriendsControllerContract } from "./types/friends.contracts";
import { FriendshipWithProfile, FriendsOverview } from "./types/friends.types";
import { LoginUser } from "../user/types/user.types";
import { Friendship, User } from "../../../generated/prisma/client";

export const friendsController: FriendsControllerContract = {
    async getRequests(
        req: Request<object, FriendshipWithProfile[], object, object, LoginUser>,
        res: Response<FriendshipWithProfile[], LoginUser>,
        next: NextFunction
    ) {
        try {
            const result = await FriendsService.getRequests(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getSuggestions(
        req: Request<object, User[], object, object, LoginUser>,
        res: Response<User[], LoginUser>,
        next: NextFunction
    ) {
        try {
            const result = await FriendsService.getSuggestions(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getAllFriends(
        req: Request<object, FriendshipWithProfile[], object, object, LoginUser>,
        res: Response<FriendshipWithProfile[], LoginUser>,
        next: NextFunction
    ) {
        try {
            const result = await FriendsService.getAllFriends(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getOverview(
        req: Request<object, FriendsOverview, object, object, LoginUser>,
        res: Response<FriendsOverview, LoginUser>,
        next: NextFunction
    ) {
        try {
            const result = await FriendsService.getOverview(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async sendRequest(
        req: Request<object, Friendship, { targetUserId: number }, object, LoginUser>,
        res: Response<Friendship, LoginUser>,
        next: NextFunction
    ) {
        try {
            const result = await FriendsService.sendRequest(res.locals.userId, Number(req.body.targetUserId));
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async acceptAction(
        req: Request<{ id: string }, { message: string; data: Friendship }, object, { type?: string }, LoginUser>,
        res: Response<{ message: string; data: Friendship }, LoginUser>,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const { type } = req.query;
            const result = await FriendsService.acceptAction(res.locals.userId, Number(id), type);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async deleteAction(
        req: Request<{ id: string }, { message: string }, object, { type?: string }, LoginUser>,
        res: Response<{ message: string }, LoginUser>,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const { type } = req.query;

            const result = await FriendsService.deleteAction(res.locals.userId, Number(id), type);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};