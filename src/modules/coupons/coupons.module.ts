import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [PurchasesModule],
  controllers: [CouponsController],
})
export class CouponsModule {}
