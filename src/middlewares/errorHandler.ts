import { NextFunction, Request, Response } from "express";
import { AppErrors } from "../errors/app.errors";

export function errorHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction,) {
    console.error("ОШИБКА НА СЕРВЕРЕ:", error);
    if (error instanceof AppErrors) {
        res.status(error.errorCode).json({
            status: "error",
            message: error.message,
        });
        return;
    }
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
}
