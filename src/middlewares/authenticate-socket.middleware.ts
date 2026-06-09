import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { LoginError } from "../errors/app.errors";
import { env } from "../config/env";

export function authSocketMiddleware(socket: Socket, next: (error?: Error) => void) {
    const authorizationHeaders = socket.handshake.auth.token || socket.handshake.headers.token;

    if (!authorizationHeaders) {
        next(new LoginError("Token is missing in headers."));
        return;
    }

    console.log(authorizationHeaders);

    const [typeToken, token] = String(authorizationHeaders).split(" ");

    if (typeToken !== "Bearer" || !token) {
        next(new LoginError("Authorization header is missing or invalid"));
        return;
    }

    try {
        const decodedToken = jwt.verify(token, env.SECRET_KEY) as {
            id: number;
            iat: number;
            exp: number;
        };

        socket.data.userId = decodedToken.id;
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error);
        next(new LoginError("Invalid or expired token"));
    }
}
