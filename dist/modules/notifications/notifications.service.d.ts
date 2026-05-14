import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { NotificationType } from '../../common/constants/app.constants';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private model;
    private readonly gateway;
    constructor(model: Model<NotificationDocument>, gateway: NotificationsGateway);
    create(userId: string, type: NotificationType, title: string, body: string, data?: object): Promise<import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    list(userId: string, page?: number, limit?: number): import("mongoose").Query<(import("mongoose").FlattenMaps<NotificationDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, NotificationDocument, "find", {}>;
    markRead(userId: string, id: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
