import { Server } from 'socket.io';
export declare class NotificationsGateway {
    private readonly logger;
    server: Server;
    emitToAll(event: string, payload: unknown): void;
    emitToUser(userId: string, event: string, payload: unknown): void;
}
