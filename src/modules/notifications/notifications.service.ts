import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { NotificationType } from '../../common/constants/app.constants';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private model: Model<NotificationDocument>,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(userId: string, type: NotificationType, title: string, body: string, data?: object) {
    const doc = await this.model.create({
      userId: new Types.ObjectId(userId),
      type,
      title,
      body,
      data,
    });
    this.gateway.emitToUser(userId, 'notification', doc.toJSON());
    return doc;
  }

  list(userId: string, page = 1, limit = 30) {
    return this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async markRead(userId: string, id: string) {
    return this.model
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        { read: true },
        { new: true },
      )
      .exec();
  }
}
