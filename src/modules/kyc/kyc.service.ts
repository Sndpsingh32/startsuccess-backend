import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kyc, KycDocument, KycStatus } from './schemas/kyc.schema';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(Kyc.name) private readonly kycModel: Model<KycDocument>,
  ) {}

  async submit(userId: string, data: Partial<Kyc>) {
    const existing = await this.kycModel.findOne({ userId });
    if (existing && existing.status === KycStatus.APPROVED) {
      throw new BadRequestException('KYC already approved');
    }

    if (existing) {
      return this.kycModel.findByIdAndUpdate(
        existing._id,
        { ...data, status: KycStatus.PENDING },
        { new: true },
      );
    }

    const created = new this.kycModel({ ...data, userId });
    return created.save();
  }

  async getStatus(userId: string) {
    const kyc = await this.kycModel.findOne({ userId });
    if (!kyc) return { status: 'NOT_SUBMITTED' };
    return kyc;
  }

  async listAll(query: { status?: KycStatus; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = query;
    const filter: any = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      this.kycModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email'),
      this.kycModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  async decide(id: string, approve: boolean, adminNote?: string) {
    const kyc = await this.kycModel.findById(id);
    if (!kyc) throw new NotFoundException('KYC record not found');

    kyc.status = approve ? KycStatus.APPROVED : KycStatus.REJECTED;
    if (adminNote) kyc.adminNote = adminNote;
    
    return kyc.save();
  }
}
