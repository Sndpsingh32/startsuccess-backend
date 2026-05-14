import { Course } from '../courses/course.schema';
export type ExplorerCourseDto = {
    id: string;
    title: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
    duration: string;
    lessons: number;
    level: string;
    price: number;
    cover: string;
    description: string;
    videos: {
        id: string;
        title: string;
        duration: string;
        locked?: boolean;
    }[];
};
export declare function mapCourseToExplorerDto(course: Course | Record<string, any>, categoryName: string, mediaBase?: string): ExplorerCourseDto;
