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
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const withdrawal_schema_1 = require("./withdrawal.schema");
const app_constants_1 = require("../../common/constants/app.constants");
const wallet_repository_1 = require("../wallet/wallet.repository");
let WithdrawalsService = class WithdrawalsService {
    constructor(connection, model, walletRepo) {
        this.connection = connection;
        this.model = model;
        this.walletRepo = walletRepo;
    }
    async request(userId, dto) {
        const w = await this.walletRepo.ensureWallet(userId);
        if (w.availableBalance < dto.amount)
            throw new common_1.BadRequestException('Insufficient balance');
        const session = await this.connection.startSession();
        let created;
        try {
            await session.withTransaction(async () => {
                const [doc] = await this.model.create([
                    {
                        userId: new mongoose_2.Types.ObjectId(userId),
                        amount: dto.amount,
                        method: dto.method,
                        accountHolderName: dto.accountHolderName,
                        bankName: dto.bankName,
                        accountNumber: dto.accountNumber,
                        ifscCode: dto.ifscCode,
                        upiId: dto.upiId,
                        paypalEmail: dto.paypalEmail,
                        status: app_constants_1.WithdrawalStatus.PENDING,
                    },
                ], { session });
                created = doc;
                await this.walletRepo.moveAvailableToPending(userId, dto.amount, doc._id.toString(), session);
            });
        }
        finally {
            await session.endSession();
        }
        return created;
    }
    listMine(userId) {
        return this.model.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
    }
    listAll(filter) {
        const page = filter.page || 1;
        const limit = filter.limit || 20;
        const q = {};
        if (filter.status)
            q.status = filter.status;
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
    async decide(id, approve, adminNote) {
        const doc = await this.model.findById(id).exec();
        if (!doc)
            throw new common_1.NotFoundException();
        if (doc.status !== app_constants_1.WithdrawalStatus.PENDING)
            throw new common_1.BadRequestException('Already processed');
        const uid = doc.userId.toString();
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.walletRepo.finalizeWithdrawal(uid, doc.amount, id, approve, session);
                doc.status = approve ? app_constants_1.WithdrawalStatus.APPROVED : app_constants_1.WithdrawalStatus.REJECTED;
                doc.adminNote = adminNote;
                await doc.save({ session });
            });
        }
        finally {
            await session.endSession();
        }
        return doc;
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(withdrawal_schema_1.Withdrawal.name)),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        mongoose_2.Model,
        wallet_repository_1.WalletRepository])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map