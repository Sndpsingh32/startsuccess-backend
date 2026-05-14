import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/app.constants';

@ApiTags('public')
@Controller('public')
@SkipThrottle()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  /** Full homepage hero payload: slides, offers, stat cards, featured courses (explorer shape). */
  @Get('hero')
  hero() {
    return this.publicService.getHeroPayload();
  }

  @Get('courses/:slug')
  courseBySlug(@Param('slug') slug: string) {
    return this.publicService.getCourseBySlug(slug);
  }

  /** Homepage course-plan book cards (tiers + copy for cover / inside page). */
  @Get('pricing-plans')
  pricingPlans() {
    return this.publicService.getPricingPlansPayload();
  }
}

@ApiTags('admin-landing')
@Controller('admin/landing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class LandingAdminController {
  constructor(private readonly publicService: PublicService) {}

  @Patch('hero')
  patchHero(@Body() body: Record<string, unknown>) {
    return this.publicService.updateLandingHero(body as any);
  }

  @Patch('pricing')
  patchPricing(@Body() body: Record<string, unknown>) {
    return this.publicService.updateLandingPricing(body as any);
  }
}
