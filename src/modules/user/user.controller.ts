import { NextFunction } from "express";
import { AvatarService } from "./avatar.service";
import { UserControllerContract } from "./types/user.contracts";
import { UserService } from "./user.service";

export const UserController: UserControllerContract = {
    async login(req, res, next) {
        try {
            const result = await UserService.login(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async register(req, res, next) {
        try {
            const result = await UserService.register(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async me(req, res, next) {
        try {
            const user = await UserService.me({ userId: res.locals.userId });
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async verify(req, res, next) {
        try {
            const result = await UserService.verify(req.body, res.locals.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async uploadAvatar(req: any, res: any, next: NextFunction) {
        try {
            const userId = res.locals.userId;
            const file = req.file;
            const rawAvatarId = req.body.avatarId;
            const avatarId = (rawAvatarId && rawAvatarId !== 'undefined') ? Number(rawAvatarId) : null;


            if (!file) {
                return res.status(400).json({ status: "error", message: "Файл не получен" });
            }

            res.setHeader('Connection', 'close');

            if (avatarId) {
                const result = await AvatarService.replaceAvatar(userId, avatarId, file);
                return res.json(result);
            } else {
                const result = await AvatarService.uploadAvatar(userId, file, true);
                return res.json(result);
            }
        } catch (error) {
            next(error);
        }
    },


    async updateProfile(req, res, next) {
        try {
            const result = await UserService.updateProfile(res.locals.userId, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};