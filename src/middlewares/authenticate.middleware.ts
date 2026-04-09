import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { LoginError } from "../errors/app.errors";
import { TokenData } from "../modules/user/types/user.types";


export function authenticateMiddleware(req: Request, res: Response, next: NextFunction,) {
	const loginUser = req.headers.authorization;
	if (!loginUser) {
		next(new LoginError("No authorization provided!"));
		return;
	}
	const [type, token] = loginUser.split(" ");
	if (type !== "Bearer" || !token) {
		next(new LoginError("Authorization is in wrong format!"));
		return;
	}

	try {
		const userData = jwt.verify(token, env.SECRET_KEY);
		if (typeof userData === "string") {
			next(new LoginError("Token is in wrong format!"));
			return
		}
		res.locals.userId = (userData as TokenData).id;
		next();
	} catch (error) {
		if (error instanceof Error && error.name === "TokenExpiredError") {
			next(new LoginError("Token is expired."));
			return
		}
		next(error);
	}
}
