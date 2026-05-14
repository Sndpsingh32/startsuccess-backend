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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const purchases_service_1 = require("../purchases/purchases.service");
const wallet_service_1 = require("../wallet/wallet.service");
const analytics_service_1 = require("../analytics/analytics.service");
let UsersController = class UsersController {
    constructor(usersService, purchasesService, walletService, analyticsService) {
        this.usersService = usersService;
        this.purchasesService = purchasesService;
        this.walletService = walletService;
        this.analyticsService = analyticsService;
    }
    async getDashboard(req) {
        const userId = req.user._id.toString();
        const user = await this.usersService.findById(userId);
        if (!user)
            return { error: 'User not found' };
        const [referrals, myPurchases, affiliateSales, wallet, summary] = await Promise.all([
            this.usersService.getReferrals(userId),
            this.purchasesService.findByUser(userId),
            user.referralCode ? this.purchasesService.findByCoupon(user.referralCode) : Promise.resolve([]),
            this.walletService.getOrCreate(userId),
            this.analyticsService.dashboardSummary(userId),
        ]);
        const conversionRate = referrals.length > 0 ? Math.min(100, (affiliateSales.length / referrals.length) * 100) : 0;
        return {
            user,
            referrals: referrals.length,
            referralList: referrals,
            myPurchases,
            affiliateSales,
            wallet,
            conversionRate: Math.round(conversionRate * 100) / 100,
            ...summary,
            totalIncome: (user.activeIncome || 0) + (user.passiveIncome || 0),
            activeIncome: user.activeIncome,
            passiveIncome: user.passiveIncome,
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDashboard", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => purchases_service_1.PurchasesService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        purchases_service_1.PurchasesService,
        wallet_service_1.WalletService,
        analytics_service_1.AnalyticsService])
], UsersController);
//# sourceMappingURL=users.controller.js.map