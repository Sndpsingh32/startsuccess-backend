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
exports.PublicService = exports.DEFAULT_LANDING_PRICING_TIERS = exports.DEFAULT_LANDING_HERO = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const landing_hero_schema_1 = require("./schemas/landing-hero.schema");
const landing_pricing_schema_1 = require("./schemas/landing-pricing.schema");
const course_schema_1 = require("../courses/course.schema");
const category_schema_1 = require("../categories/category.schema");
const course_mapper_1 = require("./course-mapper");
exports.DEFAULT_LANDING_HERO = {
    key: 'default',
    slides: [
        {
            eyebrow: 'Career transformation',
            title: 'Learn skills that',
            highlight: 'change careers',
            suffix: '.',
            description: 'Hand-crafted courses by industry experts. Live mentorship, real projects, and a referral program where everyone wins.',
        },
        {
            eyebrow: 'Industry-ready learning',
            title: 'Master tech that',
            highlight: 'builds futures',
            suffix: '.',
            description: 'Join 50,000+ students who transformed their careers with personalized guidance from top mentors.',
        },
        {
            eyebrow: 'Outcomes that matter',
            title: 'Start your',
            highlight: 'dream job',
            suffix: ' today.',
            description: '89% placement rate. Average 3x salary increase. Learn what companies actually want from day one.',
        },
    ],
    trustPills: ['50K+ learners', 'Live mentorship', 'Referral rewards'],
    announcementBadge: 'New cohorts every Monday',
    visualMeta: [
        {
            chip: 'Placement ready',
            metricLabel: 'Completion rate',
            metricValue: '92%',
            metricHint: 'Portfolio-ready finish',
        },
        {
            chip: 'Live cohort',
            metricLabel: 'Avg salary lift',
            metricValue: '3x',
            metricHint: 'After career switch',
        },
        {
            chip: 'New batch',
            metricLabel: 'Hiring partners',
            metricValue: '250+',
            metricHint: 'Active hiring network',
        },
    ],
    referralBonusLabel: '₹500 / referral',
    statCards: [
        { key: 'learners', value: 50, suffix: 'K+', label: 'Learners' },
        { key: 'courses', value: 200, suffix: '+', label: 'Courses' },
        { key: 'satisfaction', value: 98, suffix: '%', label: 'Satisfaction' },
    ],
    offers: [
        {
            id: 'o1',
            title: 'Flat 40% off on Pro Learner',
            subtitle: 'Festive season special — limited to 48 hours',
            cta: 'Claim Offer',
            tone: 'primary',
        },
        {
            id: 'o2',
            title: 'Refer & Earn ₹500 per friend',
            subtitle: 'Your friends get 20% off, you get instant credit',
            cta: 'Get Referral Link',
            tone: 'accent',
        },
        {
            id: 'o3',
            title: 'AI Engineering Bootcamp — New Batch',
            subtitle: 'Cohort starts Monday with live mentorship',
            cta: 'Enroll Now',
            tone: 'dark',
        },
    ],
};
exports.DEFAULT_LANDING_PRICING_TIERS = [
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'Perfect to dip your toes in',
        price: 499,
        period: 'month',
        features: [
            'Access to 10 starter courses',
            'Community support',
            'Mobile app access',
            'Certificate on completion',
        ],
        highlight: false,
        chip: '10 starter courses',
        savings: 'Best for first-time learners',
        description: 'Start with curated beginner courses, community support, and certificates while you explore which skill path fits you best.',
        accent: 'from-primary/70 via-primary/40 to-transparent',
    },
    {
        id: 'pro',
        name: 'Pro Learner',
        tagline: 'Most popular for serious learners',
        price: 1499,
        period: 'month',
        features: [
            'Access to all 200+ courses',
            'Live mentorship sessions',
            'Project reviews',
            'Verified certificates',
            'Offline downloads',
        ],
        highlight: true,
        badge: 'Most Popular',
        chip: '200+ full library',
        savings: 'Save ₹3,000+ vs buying courses',
        description: 'Unlock the full Star Success library with live mentorship, project reviews, verified certificates, and offline access for serious learners.',
        accent: 'from-white/35 via-white/10 to-transparent',
    },
    {
        id: 'elite',
        name: 'Elite Career',
        tagline: 'Career-changing transformation',
        price: 3999,
        period: 'month',
        features: [
            'Everything in Pro',
            '1-on-1 weekly coaching',
            'Job placement assistance',
            'Resume & interview prep',
            'Lifetime course access',
        ],
        badge: 'Best Value',
        chip: 'Career transformation',
        savings: 'Includes placement support',
        description: 'Go beyond courses with weekly 1-on-1 coaching, placement assistance, interview prep, and lifetime access for a full career switch.',
        accent: 'from-accent/80 via-accent/35 to-transparent',
    },
];
let PublicService = class PublicService {
    constructor(landingModel, landingPricingModel, courseModel, categoryModel, config) {
        this.landingModel = landingModel;
        this.landingPricingModel = landingPricingModel;
        this.courseModel = courseModel;
        this.categoryModel = categoryModel;
        this.config = config;
    }
    async ensureLandingDoc() {
        let doc = await this.landingModel.findOne({ key: 'default' }).exec();
        if (!doc) {
            doc = await this.landingModel.create({ ...exports.DEFAULT_LANDING_HERO });
        }
        return doc;
    }
    async categoryNameMap() {
        const cats = await this.categoryModel.find().lean();
        const m = new Map();
        for (const c of cats) {
            m.set(c._id.toString(), c.name);
        }
        return m;
    }
    async getHeroPayload() {
        const landing = await this.ensureLandingDoc();
        const catMap = await this.categoryNameMap();
        const mediaBase = this.config.get('media.publicBase') || '';
        let featured = await this.courseModel
            .find({ isPublished: true, featuredOnHero: true })
            .sort({ heroOrder: 1, createdAt: -1 })
            .lean()
            .exec();
        if (!featured.length) {
            featured = await this.courseModel
                .find({ isPublished: true })
                .sort({ salesCount: -1, heroOrder: -1, createdAt: -1 })
                .limit(8)
                .lean()
                .exec();
        }
        const courses = featured.map((c) => (0, course_mapper_1.mapCourseToExplorerDto)(c, catMap.get(c.categoryId?.toString()) || '', mediaBase));
        return {
            slides: landing.slides?.length ? landing.slides : exports.DEFAULT_LANDING_HERO.slides,
            trustPills: landing.trustPills?.length ? landing.trustPills : exports.DEFAULT_LANDING_HERO.trustPills,
            announcementBadge: landing.announcementBadge || exports.DEFAULT_LANDING_HERO.announcementBadge,
            visualMeta: landing.visualMeta?.length ? landing.visualMeta : exports.DEFAULT_LANDING_HERO.visualMeta,
            referralBonusLabel: landing.referralBonusLabel || exports.DEFAULT_LANDING_HERO.referralBonusLabel,
            statCards: landing.statCards?.length ? landing.statCards : exports.DEFAULT_LANDING_HERO.statCards,
            offers: landing.offers?.length ? landing.offers : exports.DEFAULT_LANDING_HERO.offers,
            courses,
        };
    }
    async getCourseBySlug(slug) {
        const c = await this.courseModel
            .findOne({ slug: slug.toLowerCase(), isPublished: true })
            .lean()
            .exec();
        if (!c)
            throw new common_1.NotFoundException('Course not found');
        const catMap = await this.categoryNameMap();
        const name = catMap.get(c.categoryId?.toString?.()) || '';
        const mediaBase = this.config.get('media.publicBase') || '';
        return (0, course_mapper_1.mapCourseToExplorerDto)(c, name, mediaBase);
    }
    async updateLandingHero(patch) {
        const { key, ...rest } = patch;
        return this.landingModel
            .findOneAndUpdate({ key: 'default' }, { $set: rest }, { new: true, upsert: true })
            .exec();
    }
    async ensureLandingPricing() {
        let doc = await this.landingPricingModel.findOne({ key: 'default' }).exec();
        if (!doc) {
            doc = await this.landingPricingModel.create({
                key: 'default',
                tiers: exports.DEFAULT_LANDING_PRICING_TIERS,
            });
        }
        return doc;
    }
    async getPricingPlansPayload() {
        const doc = await this.ensureLandingPricing();
        return {
            tiers: doc.tiers?.length ? doc.tiers : exports.DEFAULT_LANDING_PRICING_TIERS,
        };
    }
    validatePricingTiers(tiers) {
        if (!Array.isArray(tiers) || tiers.length < 1 || tiers.length > 12) {
            throw new common_1.BadRequestException('tiers must be a non-empty array (max 12)');
        }
        const seen = new Set();
        for (const t of tiers) {
            if (!t.id?.trim())
                throw new common_1.BadRequestException('Each tier needs id');
            if (seen.has(t.id))
                throw new common_1.BadRequestException(`Duplicate tier id: ${t.id}`);
            seen.add(t.id);
            if (!t.name?.trim())
                throw new common_1.BadRequestException(`Tier ${t.id}: name required`);
            if (typeof t.price !== 'number' || t.price < 0)
                throw new common_1.BadRequestException(`Tier ${t.id}: invalid price`);
            if (!t.period?.trim())
                throw new common_1.BadRequestException(`Tier ${t.id}: period required`);
            if (!Array.isArray(t.features))
                throw new common_1.BadRequestException(`Tier ${t.id}: features must be an array`);
            for (const field of ['tagline', 'chip', 'savings', 'description', 'accent']) {
                if (typeof t[field] !== 'string' || !t[field].trim()) {
                    throw new common_1.BadRequestException(`Tier ${t.id}: ${field} is required`);
                }
            }
        }
    }
    async updateLandingPricing(body) {
        await this.ensureLandingPricing();
        if (body.tiers) {
            this.validatePricingTiers(body.tiers);
            return this.landingPricingModel
                .findOneAndUpdate({ key: 'default' }, { $set: { tiers: body.tiers } }, { new: true })
                .exec();
        }
        return this.landingPricingModel.findOne({ key: 'default' }).exec();
    }
};
exports.PublicService = PublicService;
exports.PublicService = PublicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(landing_hero_schema_1.LandingHero.name)),
    __param(1, (0, mongoose_1.InjectModel)(landing_pricing_schema_1.LandingPricing.name)),
    __param(2, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __param(3, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], PublicService);
//# sourceMappingURL=public.service.js.map