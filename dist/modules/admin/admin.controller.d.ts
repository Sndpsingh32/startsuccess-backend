import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { Model } from 'mongoose';
import { CommissionDocument } from '../commission/schemas/commission.schema';
export declare class AdminController {
    private users;
    private coursesService;
    private commissionModel;
    constructor(users: UsersService, coursesService: CoursesService, commissionModel: Model<CommissionDocument>);
    stats(): Promise<{
        totalUsers: number;
        totalCourses: number;
        platformRevenue: any;
    }>;
    listUsers(page?: string, limit?: string, search?: string): Promise<{
        items: (import("mongoose").FlattenMaps<import("../users/user.schema").UserDocument> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    ban(id: string, value?: string): Promise<import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, {}> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verify(id: string, value?: string): Promise<import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, {}> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    referrals(id: string): Promise<any>;
    listCourses(): Promise<import("../courses/course.schema").Course[]>;
}
