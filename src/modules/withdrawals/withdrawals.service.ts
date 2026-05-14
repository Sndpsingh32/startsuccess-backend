import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Withdrawal, WithdrawalDocument } from './withdrawal.schema';
import { WithdrawalStatus } from '../../common/constants/app.constants';
import { WalletRepository } from '../wallet/wallet.repository';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Withdrawal.name) private model: Model<WithdrawalDocument>,
    private walletRepo: WalletRepository,
  ) {}

  async request(userId: string, dto: Partial<Withdrawal>) {
    const w = await this.walletRepo.ensureWallet(userId);
    if (w.availableBalance < dto.amount) throw new BadRequestException('Insufficient balance');

    const session = await this.connection.startSession();
    let created: WithdrawalDocument;
    try {
      await session.withTransaction(async () => {
        const [doc] = await this.model.create(
          [
            {
              userId: new Types.ObjectId(userId),
              amount: dto.amount,
              method: dto.method,
              accountHolderName: dto.accountHolderName,
              bankName: dto.bankName,
              accountNumber: dto.accountNumber,
              ifscCode: dto.ifscCode,
              upiId: dto.upiId,
              paypalEmail: dto.paypalEmail,
              status: WithdrawalStatus.PENDING,
            },
          ],
          { session },
        );
        created = doc;
        await this.walletRepo.moveAvailableToPending(
          userId,
          dto.amount,
          (doc as any)._id.toString(),
          session,
        );
      });
    } finally {
      await session.endSession();
    }
    return created;
  }

  listMine(userId: string) {
    return this.model.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
  }

  listAll(filter: { status?: WithdrawalStatus; page?: number; limit?: number }) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const q: any = {};
    if (filter.status) q.status = filter.status;
    return Promise.all([
      this.model
        .find(q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      this.model.countDocuments(q),
    ]).then(([items, total]) => ({ items, total, page, limit }));
  }

  async decide(id: string, approve: boolean, adminNote?: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException();
    if (doc.status !== WithdrawalStatus.PENDING) throw new BadRequestException('Already processed');
    const uid = (doc.userId as Types.ObjectId).toString();
    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.walletRepo.finalizeWithdrawal(uid, doc.amount, id, approve, session);
        doc.status = approve ? WithdrawalStatus.APPROVED : WithdrawalStatus.REJECTED;
        doc.adminNote = adminNote;
        await doc.save({ session });
      });
    } finally {
      await session.endSession();
    }
    return doc;
  }
}
