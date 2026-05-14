import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Commission, CommissionDocument } from '../commission/schemas/commission.schema';
import { Purchase, PurchaseDocument } from '../purchases/purchase.schema';
import { User, UserDocument } from '../users/user.schema';
import { PaymentStatus } from '../../common/constants/app.constants';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Commission.name) private commissionModel: Model<CommissionDocument>,
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async earningsSeries(userId: string, granularity: 'day' | 'week' | 'month' = 'day', days = 30) {
    const uid = new Types.ObjectId(userId);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const format = granularity === 'month' ? '%Y-%m' : '%Y-%m-%d';
    return this.commissionModel.aggregate([
      {
        $match: {
          beneficiaryUserId: uid,
          incomeCategory: { $in: ['active', 'passive'] },
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          active: {
            $sum: { $cond: [{ $eq: ['$incomeCategory', 'active'] }, '$amount', 0] },
          },
          passive: {
            $sum: { $cond: [{ $eq: ['$incomeCategory', 'passive'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async dashboardSummary(userId: string) {
    const uid = new Types.ObjectId(userId);
    const sinceDay = new Date();
    sinceDay.setHours(0, 0, 0, 0);
    const sinceWeek = new Date();
    sinceWeek.setDate(sinceWeek.getDate() - 7);
    const sinceMonth = new Date();
    sinceMonth.setMonth(sinceMonth.getMonth() - 1);

    const u = await this.userModel.findById(userId).select('referralCode').lean();
    const code = (u as any)?.referralCode;

    const [totals, daySum, weekSum, monthSum, salesCount] = await Promise.all([
      this.commissionModel.aggregate([
        { $match: { beneficiaryUserId: uid, incomeCategory: { $in: ['active', 'passive'] } } },
        {
          $group: {
            _id: null,
            active: { $sum: { $cond: [{ $eq: ['$incomeCategory', 'active'] }, '$amount', 0] } },
            passive: { $sum: { $cond: [{ $eq: ['$incomeCategory', 'passive'] }, '$amount', 0] } },
          },
        },
      ]),
      this.commissionModel.aggregate([
        {
          $match: {
            beneficiaryUserId: uid,
            incomeCategory: { $in: ['active', 'passive'] },
            createdAt: { $gte: sinceDay },
          },
        },
        { $group: { _id: null, t: { $sum: '$amount' } } },
      ]),
      this.commissionModel.aggregate([
        {
          $match: {
            beneficiaryUserId: uid,
            incomeCategory: { $in: ['active', 'passive'] },
            createdAt: { $gte: sinceWeek },
          },
        },
        { $group: { _id: null, t: { $sum: '$amount' } } },
      ]),
      this.commissionModel.aggregate([
        {
          $match: {
            beneficiaryUserId: uid,
            incomeCategory: { $in: ['active', 'passive'] },
            createdAt: { $gte: sinceMonth },
          },
        },
        { $group: { _id: null, t: { $sum: '$amount' } } },
      ]),
      code
        ? this.purchaseModel.countDocuments({
            couponUsed: code,
            paymentStatus: PaymentStatus.COMPLETED,
          })
        : Promise.resolve(0),
    ]);

    const t = totals[0] || { active: 0, passive: 0 };
    return {
      totalActive: t.active,
      totalPassive: t.passive,
      lifetimeEarnings: t.active + t.passive,
      todayIncome: daySum[0]?.t || 0,
      weeklyIncome: weekSum[0]?.t || 0,
      monthlyIncome: monthSum[0]?.t || 0,
      totalCourseSales: salesCount,
    };
  }
}
