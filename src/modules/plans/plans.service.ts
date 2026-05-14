import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './plan.schema';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async create(plan: Partial<Plan>): Promise<Plan> {
    const createdPlan = new this.planModel(plan);
    return createdPlan.save();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel.find().exec();
  }

  async findById(id: string): Promise<Plan | null> {
    return this.planModel.findById(id).exec();
  }
}