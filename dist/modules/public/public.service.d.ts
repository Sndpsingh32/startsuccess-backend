import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { LandingHero, LandingHeroDocument } from './schemas/landing-hero.schema';
import { LandingPricing, LandingPricingDocument, LandingPricingTier } from './schemas/landing-pricing.schema';
import { CourseDocument } from '../courses/course.schema';
import { CategoryDocument } from '../categories/category.schema';
import { ExplorerCourseDto } from './course-mapper';
export declare const DEFAULT_LANDING_HERO: Partial<LandingHero>;
export declare const DEFAULT_LANDING_PRICING_TIERS: LandingPricingTier[];
export declare class PublicService {
    private readonly landingModel;
    private readonly landingPricingModel;
    private readonly courseModel;
    private readonly categoryModel;
    private readonly config;
    constructor(landingModel: Model<LandingHeroDocument>, landingPricingModel: Model<LandingPricingDocument>, courseModel: Model<CourseDocument>, categoryModel: Model<CategoryDocument>, config: ConfigService);
    ensureLandingDoc(): Promise<LandingHeroDocument>;
    private categoryNameMap;
    getHeroPayload(): Promise<{
        slides: {
            eyebrow: string;
            title: string;
            highlight: string;
            suffix: string;
            description: string;
        }[];
        trustPills: string[];
        announcementBadge: string;
        visualMeta: {
            chip: string;
            metricLabel: string;
            metricValue: string;
            metricHint: string;
        }[];
        referralBonusLabel: string;
        statCards: {
            key: string;
            value: number;
            suffix: string;
            label: string;
        }[];
        offers: {
            id: string;
            title: string;
            subtitle: string;
            cta: string;
            tone: "primary" | "accent" | "dark";
        }[];
        courses: ExplorerCourseDto[];
    }>;
    getCourseBySlug(slug: string): Promise<ExplorerCourseDto>;
    updateLandingHero(patch: Partial<LandingHero>): Promise<import("mongoose").Document<unknown, {}, LandingHeroDocument, {}, {}> & LandingHero & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    ensureLandingPricing(): Promise<LandingPricingDocument>;
    getPricingPlansPayload(): Promise<{
        tiers: LandingPricingTier[];
    }>;
    private validatePricingTiers;
    updateLandingPricing(body: {
        tiers?: LandingPricingTier[];
    }): Promise<import("mongoose").Document<unknown, {}, LandingPricingDocument, {}, {}> & LandingPricing & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
