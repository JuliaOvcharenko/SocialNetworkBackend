import { Router } from "express";
import { loginSchema, registerSchema, verifySchema } from "./user.schema";
import { validateMiddleware } from "../../middlewares/validate.middleware";
import { UserController } from "./user.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";
import { uploadMiddleware, processImageMiddleware } from "../../middlewares/upload.middleware"; // 👈 Додали імпорт

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
    authenticateMiddleware, // проверяем токен
    uploadMiddleware.single("avatar"), // загружаем файл с полем "avatar"
    processImageMiddleware(300, 80), // обрабатываем изображение до 300x300 и сжимает до 80% качества
    UserController.uploadAvatar // вызываем контроллер для сохранения информации об аватаре в базе данных
);