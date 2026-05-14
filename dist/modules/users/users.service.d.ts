import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { WalletService } from '../wallet/wallet.service';
export declare class UsersService {
    private userModel;
    private readonly walletService;
    constructor(userModel: Model<UserDocument>, walletService: WalletService);
    private generateUniqueReferralCode;
    create(user: Partial<User> & {
        password: string;
    }): Promise<UserDocument>;
    findByEmail(email: string, withPassword?: boolean): Promise<UserDocument | null>;
    findByReferralCode(code: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    updateRefreshTokenHash(userId: string, hash: string | null): Promise<void>;
    findWithRefreshHash(id: string): Promise<UserDocument | null>;
    updateIncome(userId: string, active: number, passive: number, session?: any): Promise<void>;
    getReferrals(userId: string): Promise<UserDocument[]>;
    listReferralTree(userId: string, depth?: number): Promise<any>;
    adminList(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: (import("mongoose").FlattenMaps<UserDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminBan(userId: string, banned: boolean): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    adminVerifySeller(userId: string, verified: boolean): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    countTotal(): Promise<number>;
}
