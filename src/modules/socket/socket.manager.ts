import { authSocketMiddleware } from "../../middlewares/authenticate-socket.middleware";
import { ChatSocketController } from "../chat/chat.socket.controller";
import { MessageSocketController } from "../message/message.socket.controller";
import { AuthenticatedSocket, ServerSocket, SocketManagerContract } from "./socket.types";
import { Server as SocketServer } from "socket.io";
import { OnlineStatusManager } from "./online.manager"; 

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
            const userId = Number(socket.data.userId); 
            console.log(`Connected: user-${userId}`);
            
            socket.join(`user-${userId}`);

            
            const isFirstConnection = OnlineStatusManager.userConnected(userId);
            if (isFirstConnection) {
                socket.broadcast.emit("user_online", { userId });
            }

            ChatSocketController.registerHandlers(socket);
            
            if (this.socketServer) {
                MessageSocketController.registerHandlers(this.socketServer, socket);
            }
            
            socket.on("disconnect", () => {
                console.log(`Disconnected: user-${userId}`);
                
               
                const isLastDisconnect = OnlineStatusManager.userDisconnected(userId);
                if (isLastDisconnect) {
                    socket.broadcast.emit("user_offline", { userId });
                }
            });
        });
    },
    
};