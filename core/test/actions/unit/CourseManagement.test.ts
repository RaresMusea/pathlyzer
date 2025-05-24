import { saveCourse, updateCourse, deleteCourse } from '@/actions/CoursesManagement';
import { isValidAdminSession } from '@/security/Security';
import { courseAlreadyExists, courseWithIdAlreadyExists } from '@/app/service/learning/course/courseService';
import { db } from '@/persistency/Db';
import { redirect } from 'next/navigation';
import { UNAUTHORIZED_REDIRECT } from '@/routes';
import { validate } from 'uuid';

jest.mock('next/navigation', () => ({
    redirect: jest.fn((url) => {
        throw new Error(`NEXT_REDIRECT:${url}`);
    }),
}))

jest.mock('@/security/Security', () => ({
    isValidAdminSession: jest.fn(),
}));

jest.mock('@/app/service/learning/course/courseService', () => ({
    courseAlreadyExists: jest.fn(),
    courseWithIdAlreadyExists: jest.fn(),
}));

jest.mock('@/persistency/Db', () => ({
    db: {
        course: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        courseTag: {
            upsert: jest.fn(),
        },
    },
}));

const mockCourseInput = {
    name: 'Test Course',
    description: 'Test Description',
    image: 'test-image',
    difficulty: 'BEGINNER' as 'BEGINNER',
    availability: true,
    tags: [{ name: 'test-tag', id: 'tag-1' }],
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('SaveCourse server action Unit Tests', () => {
    it('should return unauthorized error if session is invalid', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(false);

        const result = await saveCourse(mockCourseInput);
        expect(result).toEqual({
            success: false,
            message: 'An unexpected error occurred while attempting to update the course. Please try again later.',
        });
    });

    it('Should return error if course already exists', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseAlreadyExists as jest.Mock).mockResolvedValue(true);

        const result = await saveCourse(mockCourseInput);

        expect(result).toHaveProperty('message');
        expect(result).toEqual({
            message: `Unable to create course '${mockCourseInput.name}', because a course with a same name already exists!`,
            success: false
        });
    });


    it('Should create course successfully', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseAlreadyExists as jest.Mock).mockResolvedValue(false);
        (db.courseTag.upsert as jest.Mock).mockImplementation((args) =>
            Promise.resolve({ id: 'tag-1', name: args.create.name })
        );
        (db.course.create as jest.Mock).mockResolvedValue({ id: 'course-1' });

        const result = await saveCourse(mockCourseInput);
        expect(result).toHaveProperty('success');
        expect(db.course.create).toHaveBeenCalled();
    });

    it('Should handle database errors', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseAlreadyExists as jest.Mock).mockResolvedValue(false);
        (db.course.create as jest.Mock).mockRejectedValue(new Error('DB error'));

        const result = await saveCourse(mockCourseInput);

        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('success', false);
        expect(result.message).toContain('unexpected error');
    });
});

describe('UpdateCourse server action Unit Tests', () => {
    const mockCourseInput = {
        name: 'Updated Course',
        description: 'Updated Description',
        image: 'updated-image',
        difficulty: 'BEGINNER' as 'BEGINNER',
        availability: true,
        tags: [{ name: 'test-tag', id: 'tag-1' }],
    };

    it('Should return error for invalid course ID', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(false);

        const result = await updateCourse('invalid-id', mockCourseInput);

        expect(result).toHaveProperty('message');
        expect(result.success).toBe(false);
        expect(result.message).toBe('An unexpected error occurred while attempting to create the course. Please try again later.');
    });

    it('Should handle validation errors', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(true);

        const invalidInput = { ...mockCourseInput, name: '' };
        const result = await updateCourse('valid-id', invalidInput);

        expect(result.success).toBe(false);
        expect(result.message).toContain('An unexpected error occurred while attempting to create the course. Please try again later.');
    });

    it('Should update course successfully', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(true);
        (db.course.update as jest.Mock).mockResolvedValue({
            id: 'course-1',
            name: 'Updated Course'
        });

        const result = await updateCourse('valid-id', mockCourseInput);
        expect(result.success).toBe(true);
        expect(result.message).toBe('Course updated successfully!');
    });

    it('Should handle database errors', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(true);
        (db.course.update as jest.Mock).mockRejectedValue(new Error('DB error'));

        await expect(updateCourse('valid-id', mockCourseInput))
            .rejects.toThrow('An unexpected error occurred');
    });
});

describe('DeleteCourse server action unit tests', () => {
    it('Should return error if course not found', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(false);

        const result = await deleteCourse('non-existent-id');

        expect(result.success).toBe(false);
        expect(result.message).toBe('The course could not be found or it was deleted earlier!');
    });

    it('Should redirect if session is invalid', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(false);

        await expect(deleteCourse('valid-id'))
            .rejects.toThrow('NEXT_REDIRECT:/unauthorized');
    });

    it('Should delete course successfully', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(true);
        (db.course.delete as jest.Mock).mockResolvedValue({
            id: 'course-1',
            name: 'Test Course'
        });

        const result = await deleteCourse('valid-id');
        expect(result.success).toBe(true);
        expect(result.message).toBe(`Successfully deleted course 'Test Course'!`);
    });

    it('Should handle database errors', async () => {
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (courseWithIdAlreadyExists as jest.Mock).mockResolvedValue(true);
        (db.course.delete as jest.Mock).mockRejectedValue(new Error('DB error'));

        const result = await deleteCourse('valid-id');
        expect(result.success).toBe(false);
        expect(result.message).toContain('unexpected error');
    });
});