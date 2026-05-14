import { Model } from 'mongoose';
import { CommissionDocument } from '../commission/schemas/commission.schema';
import { PurchaseDocument } from '../purchases/purchase.schema';
import { UserDocument } from '../users/user.schema';
export declare class AnalyticsService {
    private commissionModel;
    private purchaseModel;
    private userModel;
    constructor(commissionModel: Model<CommissionDocument>, purchaseModel: Model<PurchaseDocument>, userModel: Model<UserDocument>);
    earningsSeries(userId: string, granularity?: 'day' | 'week' | 'month', days?: number): Promise<any[]>;
    dashboardSummary(userId: string): Promise<{
        totalActive: any;
        totalPassive: any;
        lifetimeEarnings: any;
        todayIncome: any;
        weeklyIncome: any;
        monthlyIncome: any;
        totalCourseSales: number;
    }>;
}
