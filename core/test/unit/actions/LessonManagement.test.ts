import { saveFullLesson } from '@/actions/LessonsManagement';
import { isValidAdminSession } from '@/security/Security';
import { lessonContainedByUnit, getHighestOrderLesson } from '@/app/service/learning/lessons/lessonService';
import { db } from '@/persistency/Db';
import { handleError, handleSuccess } from '@/actions/globals/Generics';
import { QuestionType, QuizType } from '@prisma/client';

jest.mock('@/security/Security', () => ({
    isValidAdminSession: jest.fn()
}));

jest.mock('@/app/service/learning/lessons/lessonService', () => ({
    lessonContainedByUnit: jest.fn(),
    getHighestOrderLesson: jest.fn()
}));

jest.mock('@/persistency/Db', () => ({
    db: {
        $transaction: jest.fn()
    }
}));

jest.mock('@/actions/globals/Generics', () => ({
    handleError: jest.fn((msg) => ({ error: msg })),
    handleSuccess: jest.fn((msg) => ({ success: msg }))
}));

describe('SaveFullLesson server action unit tests', () => {
    const unitId = 'unit-123';

    const makeValidLesson = () => ({
        details: {
            title: 'Valid Title',
            description: 'Valid Description',
        },
        content: {
            content: '{"type":"doc","content":[]}'
        },
        quiz: {
            title: 'Quiz Title',
            type: QuizType.LESSON_QUIZ,
            questions: [
                {
                    type: QuestionType.SINGLE,
                    order: 0,
                    prompt: 'What is JS?',
                    rewardXp: 10,
                    choices: [
                        { text: 'A language', isCorrect: true },
                        { text: 'A library', isCorrect: false }
                    ]
                },
                {
                    type: QuestionType.CODE_FILL,
                    order: 1,
                    prompt: 'Fill in the code',
                    rewardXp: 15,
                    codeSection: {
                        code: 'console.log("~~")',
                        correct: ['Hello'],
                        language: 'javascript'
                    }
                }
            ]
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
    });

    it('Should return error if validation fails', async () => {
        const badInput = makeValidLesson();
        badInput.details.title = ''; // trigger validation error

        const result = await saveFullLesson(badInput, unitId);
        expect(result).toEqual(expect.objectContaining({ error: expect.any(String) }));
    });

    it('Should return error if unitId is undefined', async () => {
        const result = await saveFullLesson(makeValidLesson(), undefined);
        expect(result).toEqual(expect.objectContaining({ error: 'The unit ID cannot be empty!' }));
    });

    it('Should return error if lesson already exists in unit', async () => {
        (lessonContainedByUnit as jest.Mock).mockResolvedValue(true);

        const result = await saveFullLesson(makeValidLesson(), unitId);

        expect(lessonContainedByUnit).toHaveBeenCalledWith(unitId, 'Valid Title');
        expect(result).toEqual(expect.objectContaining({ error: expect.stringContaining('same name') }));
    });

    it('Should call db.$transaction and succeed', async () => {
        (lessonContainedByUnit as jest.Mock).mockResolvedValue(false);
        (getHighestOrderLesson as jest.Mock).mockResolvedValue(1);

        const txMock = {
            lesson: { create: jest.fn().mockResolvedValue({ id: 'lesson-123' }) },
            quiz: { create: jest.fn().mockResolvedValue({ id: 'quiz-456' }) },
            question: { create: jest.fn().mockResolvedValue({ id: 'question-789' }) },
            answerChoice: { createMany: jest.fn() },
            codeSection: { create: jest.fn() },
        };

        (db.$transaction as jest.Mock).mockImplementation(async (cb) => {
            return cb(txMock);
        });

        const result = await saveFullLesson(makeValidLesson(), unitId);

        expect(txMock.lesson.create).toHaveBeenCalled();
        expect(txMock.quiz.create).toHaveBeenCalled();
        expect(txMock.question.create).toHaveBeenCalledTimes(2);
        expect(txMock.answerChoice.createMany).toHaveBeenCalled();
        expect(txMock.codeSection.create).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({ success: expect.any(String) }));
    });

    it('Should return handleError if transaction fails', async () => {
        (lessonContainedByUnit as jest.Mock).mockResolvedValue(false);
        (getHighestOrderLesson as jest.Mock).mockResolvedValue(1);
        (db.$transaction as jest.Mock).mockRejectedValue(new Error('DB error'));

        const result = await saveFullLesson(makeValidLesson(), unitId);
        expect(result).toEqual(expect.objectContaining({ error: expect.any(String) }));
    });
});