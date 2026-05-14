import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema()
export class Plan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop([String])
  features: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);