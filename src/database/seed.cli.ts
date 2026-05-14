/**
 * Run: npm run seed
 * Creates default admin, categories, hero landing document, featured courses, platform settings,
 * and landing pricing tiers (always synced on each seed run).
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../modules/users/user.schema';
import { UserRole } from '../common/constants/app.constants';
import { Category, CategoryDocument } from '../modules/categories/category.schema';
import { Course, CourseDocument } from '../modules/courses/course.schema';
import { PlatformSettings, PlatformSettingsDocument } from '../modules/settings/schemas/platform-settings.schema';
import { LandingHero, LandingHeroDocument } from '../modules/public/schemas/landing-hero.schema';
import { LandingPricing, LandingPricingDocument } from '../modules/public/schemas/landing-pricing.schema';
import { DEFAULT_LANDING_HERO, DEFAULT_LANDING_PRICING_TIERS } from '../modules/public/public.service';

const cover = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=70`;

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const categoryModel = app.get<Model<CategoryDocument>>(getModelToken(Category.name));
  const courseModel = app.get<Model<CourseDocument>>(getModelToken(Course.name));
  const settingsModel = app.get<Model<PlatformSettingsDocument>>(getModelToken(PlatformSettings.name));
  const landingModel = app.get<Model<LandingHeroDocument>>(getModelToken(LandingHero.name));
  const landingPricingModel = app.get<Model<LandingPricingDocument>>(getModelToken(LandingPricing.name));

  await settingsModel.updateOne(
    { key: 'global' },
    { $setOnInsert: { key: 'global' } },
    { upsert: true },
  );

  await landingModel.updateOne(
    { key: 'default' },
    { $setOnInsert: { key: 'default', ...DEFAULT_LANDING_HERO } },
    { upsert: true },
  );

  await landingPricingModel.updateOne(
    { key: 'default' },
    {
      $set: { tiers: DEFAULT_LANDING_PRICING_TIERS },
      $setOnInsert: { key: 'default' },
    },
    { upsert: true },
  );

  const adminEmail = 'admin@edupath.local';
  let admin = await userModel.findOne({ email: adminEmail });
  if (!admin) {
    const hash = await bcrypt.hash('Admin123!', 10);
    admin = await userModel.create({
      name: 'Platform Admin',
      email: adminEmail,
      password: hash,
      referralCode: 'ADMINSEED1',
      role: UserRole.ADMIN,
      emailVerified: true,
    });
    // eslint-disable-next-line no-console
    console.log('Created admin:', adminEmail, '/ Admin123!');
  }

  const categoryDefs = [
    { name: 'Web Development', slug: 'web-development', order: 1 },
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence', order: 2 },
    { name: 'Design', slug: 'design', order: 3 },
    { name: 'Data', slug: 'data', order: 4 },
    { name: 'Cloud', slug: 'cloud', order: 5 },
    { name: 'Mobile', slug: 'mobile', order: 6 },
  ];
  const catBySlug: Record<string, any> = {};
  for (const c of categoryDefs) {
    let doc = await categoryModel.findOne({ slug: c.slug });
    if (!doc) doc = await categoryModel.create(c);
    catBySlug[c.slug] = doc;
  }

  const sampleModules = (hours: number) => [
    {
      title: 'Module 1',
      order: 0,
      lessons: [
        { title: 'Welcome & overview', durationSec: hours * 180, freePreview: true, order: 0 },
        { title: 'Core concepts', durationSec: hours * 600, order: 1 },
        { title: 'Hands-on project', durationSec: hours * 720, order: 2 },
      ],
    },
  ];

  const seedCourses: Partial<Course>[] = [
    {
      slug: 'react-mastery',
      title: 'React Mastery — From Zero to Production',
      shortDescription: 'Master modern React with hooks, performance, and real-world architecture.',
      price: 2499,
      discountPrice: 0,
      categoryId: catBySlug['web-development']._id,
      instructorName: 'Aarav Sharma',
      level: 'Intermediate',
      ratingAvg: 4.9,
      ratingCount: 120,
      salesCount: 12480,
      thumbnailUrl: cover('1633356122544-f134324a6cee'),
      featuredOnHero: true,
      heroOrder: 1,
      modules: sampleModules(32),
    },
    {
      slug: 'ai-engineering',
      title: 'AI Engineering Bootcamp',
      shortDescription: 'RAG, fine-tuning, agents — ship production AI features.',
      price: 4999,
      discountPrice: 0,
      categoryId: catBySlug['artificial-intelligence']._id,
      instructorName: 'Dr. Meera Iyer',
      level: 'Advanced',
      ratingAvg: 4.8,
      ratingCount: 90,
      salesCount: 8230,
      thumbnailUrl: cover('1677442136019-21780ecad995'),
      featuredOnHero: true,
      heroOrder: 2,
      modules: sampleModules(44),
    },
    {
      slug: 'ui-design',
      title: 'Modern UI/UX Design Systems',
      shortDescription: 'Design tokens, components, motion, accessibility.',
      price: 1799,
      discountPrice: 0,
      categoryId: catBySlug['design']._id,
      instructorName: 'Kavya Reddy',
      level: 'Beginner',
      ratingAvg: 4.9,
      ratingCount: 200,
      salesCount: 6105,
      thumbnailUrl: cover('1561070791-2526d30994b8'),
      featuredOnHero: true,
      heroOrder: 3,
      modules: sampleModules(21),
    },
    {
      slug: 'data-science',
      title: 'Data Science with Python',
      shortDescription: 'Pandas, NumPy, ML, real datasets, end-to-end projects.',
      price: 2999,
      discountPrice: 0,
      categoryId: catBySlug['data']._id,
      instructorName: 'Rohan Mehta',
      level: 'Intermediate',
      ratingAvg: 4.7,
      ratingCount: 150,
      salesCount: 9842,
      thumbnailUrl: cover('1551288049-bebda4e38f71'),
      featuredOnHero: true,
      heroOrder: 4,
      modules: sampleModules(38),
    },
    {
      slug: 'devops',
      title: 'DevOps & Cloud Engineering',
      shortDescription: 'Docker, K8s, CI/CD, AWS — modern delivery practices.',
      price: 3499,
      discountPrice: 0,
      categoryId: catBySlug['cloud']._id,
      instructorName: 'Priya Nair',
      level: 'Advanced',
      ratingAvg: 4.8,
      ratingCount: 80,
      salesCount: 5421,
      thumbnailUrl: cover('1518770660439-4636190af475'),
      featuredOnHero: true,
      heroOrder: 5,
      modules: sampleModules(29),
    },
    {
      slug: 'mobile',
      title: 'Cross-Platform Mobile with React Native',
      shortDescription: 'Build and ship iOS + Android apps from one codebase.',
      price: 2299,
      discountPrice: 0,
      categoryId: catBySlug['mobile']._id,
      instructorName: 'Ishaan Verma',
      level: 'Intermediate',
      ratingAvg: 4.6,
      ratingCount: 70,
      salesCount: 4310,
      thumbnailUrl: cover('1512941937669-90a1b58e7e9c'),
      featuredOnHero: true,
      heroOrder: 6,
      modules: sampleModules(26),
    },
  ];

  for (const sc of seedCourses) {
    const exists = await courseModel.findOne({ slug: sc.slug });
    if (!exists) {
      await courseModel.create({
        ...sc,
        uploadedBy: admin._id,
        isPublished: true,
        language: 'en',
        videos: [],
        images: [],
      });
      // eslint-disable-next-line no-console
      console.log('Seeded course', sc.slug);
    }
  }

  await app.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
