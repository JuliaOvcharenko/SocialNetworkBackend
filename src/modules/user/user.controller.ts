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

            if (!file) {
                return res.status(400).json({ status: "error", message: "Файл не получен" });
            }

            res.setHeader("Connection", "close");

            const result = await AvatarService.uploadAvatar(userId, file);
            return res.json(result);
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
    },

    async logout(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(400).json({ message: "No token provided" });
                return;
            }
            const result = await UserService.logout(token);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const user = await UserService.getById(Number(req.params.id));
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
};
