import { AnalyticsService } from './analytics.service';
import { Model } from 'mongoose';
import { CommissionDocument } from '../commission/schemas/commission.schema';
export declare class AnalyticsController {
    private readonly analytics;
    private commissionModel;
    constructor(analytics: AnalyticsService, commissionModel: Model<CommissionDocument>);
    summary(user: any): Promise<{
        totalActive: any;
        totalPassive: any;
        lifetimeEarnings: any;
        todayIncome: any;
        weeklyIncome: any;
        monthlyIncome: any;
        totalCourseSales: number;
    }>;
    earnings(user: any, g?: 'day' | 'week' | 'month', days?: string): Promise<any[]>;
    platformRevenue(): Promise<{
        platformRevenueTotal: any;
    }>;
}
