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
			const result = await UserService.verify(req.body);
			res.json(result);
		} catch (error) {
			next(error);
		}
	},
};