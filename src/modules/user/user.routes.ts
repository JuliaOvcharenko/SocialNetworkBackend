import { Router } from "express";
import { loginSchema, registerSchema, verifySchema } from "./user.schema";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { UserController } from "./user.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { uploadMiddleware, processImageMiddleware } from "../../middlewares/upload.middleware"; 

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

UserRoutes.post(
    "/verify",
    authenticateMiddleware,
    validateMiddleware(verifySchema),
    UserController.verify,
);


UserRoutes.post(
    "/avatar",
    authenticateMiddleware, 
    uploadMiddleware.single("avatar"), 
    processImageMiddleware(300, 80), 
    UserController.uploadAvatar 
);

UserRoutes.patch(
    "/me", 
    authenticateMiddleware, 
    UserController.updateProfile 
);