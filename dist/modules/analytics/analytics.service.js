"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const commission_schema_1 = require("../commission/schemas/commission.schema");
const purchase_schema_1 = require("../purchases/purchase.schema");
const user_schema_1 = require("../users/user.schema");
const app_constants_1 = require("../../common/constants/app.constants");
let AnalyticsService = class AnalyticsService {
    constructor(commissionModel, purchaseModel, userModel) {
        this.commissionModel = commissionModel;
        this.purchaseModel = purchaseModel;
        this.userModel = userModel;
    }
    async earningsSeries(userId, granularity = 'day', days = 30) {
        const uid = new mongoose_2.Types.ObjectId(userId);
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
    async dashboardSummary(userId) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const sinceDay = new Date();
        sinceDay.setHours(0, 0, 0, 0);
        const sinceWeek = new Date();
        sinceWeek.setDate(sinceWeek.getDate() - 7);
        const sinceMonth = new Date();
        sinceMonth.setMonth(sinceMonth.getMonth() - 1);
        const u = await this.userModel.findById(userId).select('referralCode').lean();
        const code = u?.referralCode;
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
                    paymentStatus: app_constants_1.PaymentStatus.COMPLETED,
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(commission_schema_1.Commission.name)),
    __param(1, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map