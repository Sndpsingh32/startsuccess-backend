import { Connection, Model, Types } from 'mongoose';
import { Withdrawal, WithdrawalDocument } from './withdrawal.schema';
import { WithdrawalStatus } from '../../common/constants/app.constants';
import { WalletRepository } from '../wallet/wallet.repository';
export declare class WithdrawalsService {
    private readonly connection;
    private model;
    private walletRepo;
    constructor(connection: Connection, model: Model<WithdrawalDocument>, walletRepo: WalletRepository);
    request(userId: string, dto: Partial<Withdrawal>): Promise<WithdrawalDocument>;
    listMine(userId: string): import("mongoose").Query<(import("mongoose").FlattenMaps<WithdrawalDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, WithdrawalDocument, {}, {}> & Withdrawal & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, WithdrawalDocument, "find", {}>;
    listAll(filter: {
        status?: WithdrawalStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        items: (import("mongoose").FlattenMaps<WithdrawalDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    decide(id: string, approve: boolean, adminNote?: string): Promise<import("mongoose").Document<unknown, {}, WithdrawalDocument, {}, {}> & Withdrawal & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
