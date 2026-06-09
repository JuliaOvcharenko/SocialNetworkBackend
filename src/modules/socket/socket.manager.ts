import { authSocketMiddleware } from "../../middlewares/authenticate-socket.middleware";
import { ChatSocketController } from "../chat/chat.socket.controller";
import { MessageSocketController } from "../message/message.socket.controller";
import { AuthenticatedSocket, ServerSocket, SocketManagerContract } from "./socket.types";
import { Server as SocketServer } from "socket.io";

export const SocketManager: SocketManagerContract = {
    socketServer: null,
    initSocketServer(httpServer) {
        this.socketServer = new SocketServer<ServerSocket>(httpServer, {
            cors: {
                origin: "*",
            },
        });
        this.socketServer.use(authSocketMiddleware);
        this.socketServer.on("connection", (socket: AuthenticatedSocket) => {
            console.log("Connected");
            socket.join(`user-${socket.data.userId}`);
            ChatSocketController.registerHandlers(socket);
            console.log(`user-${socket.data.userId}`);
            if (this.socketServer) {
                MessageSocketController.registerHandlers(this.socketServer, socket);
            }
            socket.on("disconnect", () => {
                console.log("Disconnected");
            });
        });
    },
};
