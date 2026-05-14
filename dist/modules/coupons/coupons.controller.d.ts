import { PurchasesService } from '../purchases/purchases.service';
import { ConfigService } from '@nestjs/config';
export declare class CouponsController {
    private purchases;
    private config;
    constructor(purchases: PurchasesService, config: ConfigService);
    me(user: any): {
        code: any;
        referralLink: string;
        qrData: string;
    };
    performance(user: any, page?: string, limit?: string): Promise<{
        items: (import("mongoose").FlattenMaps<import("../purchases/purchase.schema").PurchaseDocument> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
