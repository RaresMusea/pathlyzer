import { enroll } from '@/actions/CourseEnrollment';
import { isValidSession } from '@/security/Security';
import { getCourseById } from '@/app/service/learning/course/courseService';
import { enrollmentExists, enrollToCourse } from '@/app/service/learning/course/enrollmentService';
import { handleError, handleSuccess } from '@/actions/globals/Generics';
import { redirect } from 'next/navigation';

jest.mock('@/security/Security', () => ({
    isValidSession: jest.fn()
}));

jest.mock('@/app/service/learning/course/courseService', () => ({
    getCourseById: jest.fn()
}));

jest.mock('@/app/service/learning/course/enrollmentService', () => ({
    enrollmentExists: jest.fn(),
    enrollToCourse: jest.fn()
}));

jest.mock('@/actions/globals/Generics', () => ({
    handleError: jest.fn(),
    handleSuccess: jest.fn()
}));

jest.mock('next/navigation', () => ({
    redirect: jest.fn()
}));

describe('CourseEnrollment Server Action Unit Tests', () => {
    const fakeCourse = { id: '123', name: 'Test Course' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should redirect to login if session is invalid', async () => {
        (isValidSession as jest.Mock).mockResolvedValue(false);

        await enroll('123');

        expect(redirect).toHaveBeenCalledWith('/login');
    });

    it('Should throw error if courseId is missing', async () => {
        (isValidSession as jest.Mock).mockResolvedValue(true);

        await expect(enroll('')).rejects.toThrow('The course ID cannot be null or empty!');
    });

    it('Should return error if course does not exist', async () => {
        (isValidSession as jest.Mock).mockResolvedValue(true);
        (getCourseById as jest.Mock).mockResolvedValue(undefined);
        (handleError as jest.Mock).mockReturnValue({ error: 'course not found' });

        const result = await enroll('123');
        expect(handleError).toHaveBeenCalledWith(expect.stringContaining('Maybe it was removed'));
        expect(result).toEqual({ error: 'course not found' });
    });

    it('Should return error if already enrolled', async () => {
        (isValidSession as jest.Mock).mockResolvedValue(true);
        (getCourseById as jest.Mock).mockResolvedValue(fakeCourse);
        (enrollmentExists as jest.Mock).mockResolvedValue(true);
        (handleError as jest.Mock).mockReturnValue({ error: 'already enrolled' });

        const result = await enroll('123');
        expect(handleError).toHaveBeenCalledWith(expect.stringContaining('already'));
        expect(result).toEqual({ error: 'already enrolled' });
    });

    it('Should return success if enrollment works', async () => {
        (isValidSession as jest.Mock).mockResolvedValue(true);
        (getCourseById as jest.Mock).mockResolvedValue(fakeCourse);
        (enrollmentExists as jest.Mock).mockResolvedValue(false);
        (enrollToCourse as jest.Mock).mockResolvedValue({ id: 'enroll-id' });
        (handleSuccess as jest.Mock).mockReturnValue({ success: 'enrolled ok' });

        const result = await enroll('123');
        expect(handleSuccess).toHaveBeenCalledWith(expect.stringContaining(fakeCourse.name));
        expect(result).toEqual({ success: 'enrolled ok' });
    });

    it('Should return error if enrollToCourse fails', async () => {
        (isValidSession as jest.Mock).mockResolvedValue(true);
        (getCourseById as jest.Mock).mockResolvedValue(fakeCourse);
        (enrollmentExists as jest.Mock).mockResolvedValue(false);
        (enrollToCourse as jest.Mock).mockResolvedValue(null);
        (handleError as jest.Mock).mockReturnValue({ error: 'internal error' });

        const result = await enroll('123');
        expect(handleError).toHaveBeenCalledWith(expect.stringContaining('unexpected'));
        expect(result).toEqual({ error: 'internal error' });
    });
});
