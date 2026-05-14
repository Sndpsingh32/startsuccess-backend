import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';
import { Commission, CommissionSchema } from '../commission/schemas/commission.schema';

@Module({
  imports: [
    UsersModule,
    CoursesModule,
    MongooseModule.forFeature([{ name: Commission.name, schema: CommissionSchema }]),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
