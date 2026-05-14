import { Model } from 'mongoose';
import { Plan, PlanDocument } from './plan.schema';
export declare class PlansService {
    private planModel;
    constructor(planModel: Model<PlanDocument>);
    create(plan: Partial<Plan>): Promise<Plan>;
    findAll(): Promise<Plan[]>;
    findById(id: string): Promise<Plan | null>;
}
