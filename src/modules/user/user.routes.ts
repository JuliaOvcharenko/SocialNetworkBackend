import { Router } from "express";
import { loginSchema, registerSchema } from "./user.schema";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { processImageMiddleware, uploadMiddleware } from "../../middlewares/upload.middleware";
import { UserController } from "./user.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";


export const UserRoutes = Router();

UserRoutes.post(
	"/login",
	validateMiddleware(loginSchema),
	UserController.login,
);
UserRoutes.post(
	"/register",
	validateMiddleware(registerSchema),
	UserController.register,
);
UserRoutes.get("/me", authenticateMiddleware, UserController.me);