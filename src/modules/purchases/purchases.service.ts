import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Purchase, PurchaseDocument } from './purchase.schema';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { RevenueDistributionService } from '../commission/revenue-distribution.service';
import { SettingsService } from '../settings/settings.service';
import { PaymentStatus } from '../../common/constants/app.constants';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    private usersService: UsersService,
    private coursesService: CoursesService,
    private revenueDistributionService: RevenueDistributionService,
    private settingsService: SettingsService,
  ) {}

  effectiveCoursePrice(course: any): number {
    const d = course.discountPrice;
    if (d != null && d > 0) return d;
    return course.price ?? 0;
  }

  async create(purchase: Partial<Purchase> & { buyerId: string }): Promise<Purchase> {
    const course = await this.coursesService.findById(purchase.courseId as any);
    if (!course) throw new NotFoundException('Course not found');
    if (!course.isPublished) throw new BadRequestException('Course is not available');

    const expected = this.effectiveCoursePrice(course);
    const paid = purchase.amount ?? expected;
    if (Math.abs(paid - expected) > 0.02) {
      throw new BadRequestException(`Amount must match course price (${expected})`);
    }

    const buyerOid = new Types.ObjectId(purchase.buyerId);
    const courseOid = new Types.ObjectId(purchase.courseId as any);

    const dup = await this.purchaseModel
      .findOne({
        buyerId: buyerOid,
        courseId: courseOid,
        paymentStatus: PaymentStatus.COMPLETED,
      })
      .exec();
    if (dup) throw new ConflictException('Course already purchased');

    const settings = await this.settingsService.getGlobal();
    let couponOwner = null as any;
    if (purchase.couponUsed) {
      couponOwner = await this.usersService.findByReferralCode(purchase.couponUsed);
      if (!couponOwner) throw new BadRequestException('Invalid coupon code');
      if (!course.couponApplicable) throw new BadRequestException('Coupons not allowed for this course');
      if (settings.fraudBlockCouponOwnerPurchase && couponOwner._id.equals(buyerOid)) {
        throw new BadRequestException('Cannot purchase using your own coupon');
      }
    }

    const doc = new this.purchaseModel({
      courseId: courseOid,
      buyerId: buyerOid,
      couponUsed: purchase.couponUsed?.toUpperCase?.() || purchase.couponUsed,
      amount: paid,
      currency: purchase.currency || 'INR',
      paymentStatus: PaymentStatus.PENDING,
      paymentId: purchase.paymentId || null,
      commissionsDistributed: false,
      courseSnapshot: {
        title: course.title,
        slug: course.slug,
        price: course.price,
        discountPrice: course.discountPrice,
      },
    });
    const saved = await doc.save();

    if (couponOwner) {
      await this.revenueDistributionService.distributePurchase(saved, course as any, couponOwner);
      await this.coursesService.incrementSales((course as any)._id.toString());
    } else {
      await this.revenueDistributionService.distributePlatformOnly(saved);
      await this.coursesService.incrementSales((course as any)._id.toString());
    }

    return this.purchaseModel.findById(saved._id).exec();
  }

  async findByUser(userId: string): Promise<Purchase[]> {
    return this.purchaseModel
      .find({ buyerId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec() as any;
  }

  async findByCoupon(coupon: string): Promise<Purchase[]> {
    return this.purchaseModel
      .find({ couponUsed: coupon?.toUpperCase() })
      .sort({ createdAt: -1 })
      .exec();
  }

  async listAffiliateSales(
    couponCode: string,
    opts: { from?: Date; to?: Date; page?: number; limit?: number },
  ) {
    const filter: any = { couponUsed: couponCode?.toUpperCase(), paymentStatus: PaymentStatus.COMPLETED };
    if (opts.from || opts.to) {
      filter.createdAt = {};
      if (opts.from) filter.createdAt.$gte = opts.from;
      if (opts.to) filter.createdAt.$lte = opts.to;
    }
    const page = opts.page || 1;
    const limit = opts.limit || 20;
    const [items, total] = await Promise.all([
      this.purchaseModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('buyerId', 'name email')
        .populate('courseId', 'title slug')
        .lean(),
      this.purchaseModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }
}
