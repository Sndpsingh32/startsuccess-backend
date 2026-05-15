import { Model } from 'mongoose';
import { Kyc, KycDocument, KycStatus } from './schemas/kyc.schema';
export declare class KycService {
    private readonly kycModel;
    constructor(kycModel: Model<KycDocument>);
    submit(userId: string, data: Partial<Kyc>): Promise<import("mongoose").Document<unknown, {}, KycDocument, {}, {}> & Kyc & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getStatus(userId: string): Promise<(import("mongoose").Document<unknown, {}, KycDocument, {}, {}> & Kyc & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        status: string;
    }>;
    listAll(query: {
        status?: KycStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        items: (import("mongoose").Document<unknown, {}, KycDocument, {}, {}> & Kyc & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    decide(id: string, approve: boolean, adminNote?: string): Promise<import("mongoose").Document<unknown, {}, KycDocument, {}, {}> & Kyc & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
