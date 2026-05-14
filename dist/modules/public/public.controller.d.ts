import { PublicService } from './public.service';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    hero(): Promise<{
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
        courses: import("./course-mapper").ExplorerCourseDto[];
    }>;
    courseBySlug(slug: string): Promise<import("./course-mapper").ExplorerCourseDto>;
    pricingPlans(): Promise<{
        tiers: import("./schemas/landing-pricing.schema").LandingPricingTier[];
    }>;
}
export declare class LandingAdminController {
    private readonly publicService;
    constructor(publicService: PublicService);
    patchHero(body: Record<string, unknown>): Promise<import("mongoose").Document<unknown, {}, import("./schemas/landing-hero.schema").LandingHeroDocument, {}, {}> & import("./schemas/landing-hero.schema").LandingHero & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    patchPricing(body: Record<string, unknown>): Promise<import("mongoose").Document<unknown, {}, import("./schemas/landing-pricing.schema").LandingPricingDocument, {}, {}> & import("./schemas/landing-pricing.schema").LandingPricing & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
