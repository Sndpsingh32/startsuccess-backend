import { Controller, Get, UseGuards, Request, Inject, forwardRef } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PurchasesService } from '../purchases/purchases.service';
import { WalletService } from '../wallet/wallet.service';
import { AnalyticsService } from '../analytics/analytics.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(forwardRef(() => PurchasesService)) private purchasesService: PurchasesService,
    private walletService: WalletService,
    private analyticsService: AnalyticsService,
  ) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getDashboard(@Request() req) {
    const userId = req.user._id.toString();
    const user = await this.usersService.findById(userId);
    if (!user) return { error: 'User not found' };
    const [referrals, myPurchases, affiliateSales, wallet, summary] = await Promise.all([
      this.usersService.getReferrals(userId),
      this.purchasesService.findByUser(userId),
      user.referralCode ? this.purchasesService.findByCoupon(user.referralCode) : Promise.resolve([]),
      this.walletService.getOrCreate(userId),
      this.analyticsService.dashboardSummary(userId),
    ]);

    const conversionRate =
      referrals.length > 0 ? Math.min(100, (affiliateSales.length / referrals.length) * 100) : 0;

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
}
