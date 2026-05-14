import { UsersService } from './users.service';
import { PurchasesService } from '../purchases/purchases.service';
import { WalletService } from '../wallet/wallet.service';
import { AnalyticsService } from '../analytics/analytics.service';
export declare class UsersController {
    private usersService;
    private purchasesService;
    private walletService;
    private analyticsService;
    constructor(usersService: UsersService, purchasesService: PurchasesService, walletService: WalletService, analyticsService: AnalyticsService);
    getDashboard(req: any): Promise<{
        error: string;
    } | {
        totalIncome: number;
        activeIncome: number;
        passiveIncome: number;
        totalActive: any;
        totalPassive: any;
        lifetimeEarnings: any;
        todayIncome: any;
        weeklyIncome: any;
        monthlyIncome: any;
        totalCourseSales: number;
        user: import("./user.schema").UserDocument;
        referrals: number;
        referralList: import("./user.schema").UserDocument[];
        myPurchases: import("../purchases/purchase.schema").Purchase[];
        affiliateSales: any[];
        wallet: import("mongoose").Document<unknown, {}, import("../wallet/schemas/wallet.schema").WalletDocument, {}, {}> & import("../wallet/schemas/wallet.schema").Wallet & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        conversionRate: number;
        error?: undefined;
    }>;
}
