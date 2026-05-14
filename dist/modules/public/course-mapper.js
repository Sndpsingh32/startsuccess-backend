"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCourseToExplorerDto = mapCourseToExplorerDto;
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=70';
function resolveCoverUrl(course, mediaBase) {
    const v0 = course.videos?.[0];
    const legacyVideo = typeof v0 === 'string' && v0.trim() ? v0.trim() : undefined;
    const candidates = [course.thumbnailUrl, course.images?.[0], course.bannerUrl, legacyVideo];
    const raw = candidates.find((x) => typeof x === 'string' && String(x).trim().length > 0);
    const u = (raw || '').trim();
    if (!u)
        return DEFAULT_COVER;
    if (u.startsWith('//'))
        return `https:${u}`;
    if (u.startsWith('http://') || u.startsWith('https://'))
        return u;
    if (u.startsWith('/') && mediaBase) {
        return `${mediaBase.replace(/\/$/, '')}${u}`;
    }
    if (u.startsWith('/'))
        return DEFAULT_COVER;
    return u;
}
function formatDuration(totalSec) {
    if (!totalSec || totalSec <= 0)
        return '—';
    const h = Math.round(totalSec / 3600);
    if (h >= 1)
        return `${h}h`;
    const m = Math.round(totalSec / 60);
    return `${m}m`;
}
function flattenLessons(modules) {
    const out = [];
    if (!modules?.length)
        return out;
    for (const mod of modules) {
        for (const les of mod.lessons || []) {
            out.push({
                title: les.title,
                durationSec: les.durationSec || 0,
                freePreview: les.freePreview,
            });
        }
    }
    return out;
}
function mapCourseToExplorerDto(course, categoryName, mediaBase) {
    const lessons = flattenLessons(course.modules);
    const totalSec = lessons.reduce((s, l) => s + (l.durationSec || 0), 0);
    const duration = course.durationLabel ||
        (totalSec > 0 ? formatDuration(totalSec) : course.videos?.length ? `${course.videos.length * 2}h` : '—');
    const lessonCount = course.lessonCount > 0 ? course.lessonCount : lessons.length || Math.max(1, course.videos?.length || 0);
    const price = course.discountPrice > 0 ? course.discountPrice : course.price;
    const cover = resolveCoverUrl(course, mediaBase);
    const videos = lessons.slice(0, 12).map((l, i) => ({
        id: `l-${i}`,
        title: l.title,
        duration: formatDuration(l.durationSec || 300),
        locked: i > 2 && !l.freePreview,
    }));
    if (!videos.length && course.videos?.length) {
        course.videos.slice(0, 8).forEach((_url, i) => {
            videos.push({ id: `v${i}`, title: `Lesson ${i + 1}`, duration: '12:00', locked: i > 2 });
        });
    }
    return {
        id: course.slug,
        title: course.title,
        category: categoryName || 'General',
        instructor: course.instructorName || 'Expert Instructor',
        rating: course.ratingAvg > 0 ? Math.round(course.ratingAvg * 10) / 10 : 4.8,
        students: course.salesCount || 0,
        duration,
        lessons: lessonCount,
        level: course.level || 'Intermediate',
        price,
        cover,
        description: course.shortDescription || course.fullDescription || '',
        videos: videos.length ? videos : [{ id: 'v1', title: 'Introduction', duration: '10:00' }],
    };
}
//# sourceMappingURL=course-mapper.js.map