import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly svc;
    constructor(svc: NotificationsService);
    list(user: any, page?: string, limit?: string): import("mongoose").Query<(import("mongoose").FlattenMaps<import("./notification.schema").NotificationDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationDocument, {}, {}> & import("./notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, import("./notification.schema").NotificationDocument, "find", {}>;
    markRead(user: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationDocument, {}, {}> & import("./notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
