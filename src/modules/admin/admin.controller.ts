import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/app.constants';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commission, CommissionDocument } from '../commission/schemas/commission.schema';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private users: UsersService,
    private coursesService: CoursesService,
    @InjectModel(Commission.name) private commissionModel: Model<CommissionDocument>,
  ) {}

  @Get('stats')
  async stats() {
    const [users, courses, revenue] = await Promise.all([
      this.users.countTotal(),
      this.coursesService.findAllAdmin().then((r) => r.length),
      this.commissionModel.aggregate([
        { $match: { incomeCategory: 'platform' } },
        { $group: { _id: null, t: { $sum: '$amount' } } },
      ]),
    ]);
    return {
      totalUsers: users,
      totalCourses: courses,
      platformRevenue: revenue[0]?.t || 0,
    };
  }

  @Get('users')
  listUsers(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.users.adminList({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
      search,
    });
  }

  @Patch('users/:id/ban')
  ban(@Param('id') id: string, @Query('value') value?: string) {
    return this.users.adminBan(id, value !== 'false');
  }

  @Patch('users/:id/verify-seller')
  verify(@Param('id') id: string, @Query('value') value?: string) {
    return this.users.adminVerifySeller(id, value !== 'false');
  }

  @Get('users/:id/referrals')
  referrals(@Param('id') id: string) {
    return this.users.listReferralTree(id, 5);
  }

  @Get('courses')
  listCourses() {
    return this.coursesService.findAllAdmin();
  }
}
