import { Request, Response, NextFunction } from "express";
import { FriendsService } from "./friends.service";

export const friendsController = {
    async getRequests(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FriendsService.getRequests(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getSuggestions(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FriendsService.getSuggestions(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getAllFriends(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FriendsService.getAllFriends(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getOverview(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FriendsService.getOverview(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async sendRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await FriendsService.sendRequest(res.locals.userId, Number(req.body.targetUserId));
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async acceptAction(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const type = req.query.type as string;
            const result = await FriendsService.acceptAction(res.locals.userId, Number(id), type);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async deleteAction(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const type = req.query.type as string;

            const result = await FriendsService.deleteAction(res.locals.userId, Number(id), type);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};