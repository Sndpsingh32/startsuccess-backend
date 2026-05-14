import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PurchasesService } from '../purchases/purchases.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(
    private purchases: PurchasesService,
    private config: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: any) {
    const base = this.config.get<string>('frontendUrl') || 'http://localhost:5173';
    const code = user.referralCode;
    return {
      code,
      referralLink: `${base}/signup?ref=${code}`,
      qrData: `${base}/signup?ref=${code}`,
    };
  }

  @Get('me/performance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  performance(@CurrentUser() user: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.purchases.listAffiliateSales(user.referralCode, {
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
    });
  }
}
