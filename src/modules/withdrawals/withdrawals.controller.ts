import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/app.constants';
import { WithdrawalStatus } from '../../common/constants/app.constants';

@ApiTags('withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly svc: WithdrawalsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  request(@CurrentUser() user: any, @Body() body: any) {
    return this.svc.request(user._id.toString(), body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  mine(@CurrentUser() user: any) {
    return this.svc.listMine(user._id.toString());
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  adminList(@Query('status') status?: WithdrawalStatus, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.listAll({
      status,
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
    });
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  decide(@Param('id') id: string, @Body() body: { approve: boolean; adminNote?: string }) {
    return this.svc.decide(id, body.approve, body.adminNote);
  }
}
