export class OnlineStatusManager {
    private static onlineUsers = new Map<number, number>();

    static userConnected(userId: number) {
        const currentCount = this.onlineUsers.get(userId) || 0;
        this.onlineUsers.set(userId, currentCount + 1);
        
        return currentCount === 0;
    }

    static userDisconnected(userId: number) {
        const currentCount = this.onlineUsers.get(userId) || 0;
        if (currentCount <= 1) {
            this.onlineUsers.delete(userId);
            return true;
        } else {
            this.onlineUsers.set(userId, currentCount - 1);
            return false;
        }
    }

    static isUserOnline(userId: number): boolean {
        return this.onlineUsers.has(userId);
    }
}