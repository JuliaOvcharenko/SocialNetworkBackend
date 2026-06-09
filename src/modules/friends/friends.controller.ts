import { FriendsService } from "./friends.service";
import { FriendsControllerContract } from "./types/friends.contracts";

export const friendsController: FriendsControllerContract = {
    async getRequests(req, res, next) {
        try {
            const result = await FriendsService.getRequests(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getSuggestions(req, res, next) {
        try {
            const result = await FriendsService.getSuggestions(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getAllFriends(req, res, next) {
        try {
            const result = await FriendsService.getAllFriends(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getOverview(req, res, next) {
        try {
            const result = await FriendsService.getOverview(res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async sendRequest(req, res, next) {
        try {
            const result = await FriendsService.sendRequest(
                res.locals.userId,
                Number(req.body.targetUserId),
            );
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async acceptRequest(req, res, next) {
        try {
            const result = await FriendsService.acceptRequest(
                res.locals.userId,
                Number(req.params.id),
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async deleteRequest(req, res, next) {
        try {
            const result = await FriendsService.deleteRequest(
                res.locals.userId,
                Number(req.params.id),
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async deleteFriend(req, res, next) {
        try {
            const result = await FriendsService.deleteFriend(
                res.locals.userId,
                Number(req.params.id),
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
