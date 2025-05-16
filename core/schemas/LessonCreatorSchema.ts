import { FieldErrors } from 'react-hook-form';
import * as z from 'zod';

const LessonDetailsSchema = z.object({
    title: z.string()
        .min(5, "Lesson title must be at least 5 characters long")
        .max(80, "Lesson title must not exceed 80 characters"),

    description: z.string()
        .min(10, "Lesson description must have at least 10 characters.")
        .max(150, "Lesson description must not exceed 150 characters"),
});

const LessonContentSchema = z.object({
    content: z.string().min(10, "Lesson content is required"),
});

const SingleQuestionSchema = z.object({
    id: z.string().optional(),
    type: z.literal("SINGLE"),
    prompt: z.string().min(1, "Question prompt is required!").max(400, "The question prompt cannot exceed 400 characters!"),
    order: z.number().int().nonnegative(),
    rewardXp: z.number()
        .int("Reward XP must be an integer")
        .positive("Reward XP must be greater than 0"),
    choices: z.array(
        z.object({
            id: z.string().optional(),
            text: z.string().min(1, "Answer choice text is required!").max(250, 'Answer choice must not exceed 250 characters!'),
            isCorrect: z.boolean(),
        })
    )
        .min(2, "At least two choices are required")
        .refine((choices) => choices.filter(c => c.isCorrect).length === 1, {
            message: "Exactly one correct answer is required"
        }),
});

const MultipleQuestionSchema = z.object({
    id: z.string().optional(),
    type: z.literal("MULTIPLE"),
    prompt: z.string().min(1, 'Question prompt is required!').max(400, 'The question prompt cannot exceed 400 characters!'),
    order: z.number().int().nonnegative(),
    rewardXp: z.number()
        .int("Reward XP must be an integer")
        .positive("Reward XP must be greater than 0"),
    choices: z.array(
        z.object({
            id: z.string().optional(),
            text: z.string().min(1, 'Answer choice text is required!').max(250, 'Answer choice must not exceed 250 characters!'),
            isCorrect: z.boolean(),
        })
    )
        .min(2)
        .refine((choices) => choices.filter(c => c.isCorrect).length >= 2, {
            message: "At least two correct answers must be selected"
        })
});

const CodeFillQuestionSchema = z.object({
    id: z.string().optional(),
    type: z.literal("CODE_FILL"),
    prompt: z.string().min(1, 'Question prompt is required!').max(400, 'The question prompt cannot exceed 400 characters!'),
    order: z.number().int().nonnegative(),
    rewardXp: z.number()
        .int("Reward XP must be an integer")
        .positive("Reward XP must be greater than 0"),
    codeSection: z.object({
        id: z.string().optional(),
        code: z.string().min(1, "Code section is required"),
        language: z.string().min(1, "Language is required"),
        correct: z.array(z.string().min(1)).min(1, "At least one correct answer is required"),
    })
});

const QuestionSchema = z.discriminatedUnion("type", [
    SingleQuestionSchema,
    MultipleQuestionSchema,
    CodeFillQuestionSchema,
]);

const QuizSchema = z.object({
    title: z.string()
        .min(5, "Quiz title must be at least 5 characters")
        .max(100, "Quiz title must be at most 100 characters"),

    type: z.literal("LESSON_QUIZ"),
    questions: z.array(QuestionSchema)
        .min(1, "Quiz must contain at least one question")
});

export const FullLessonSchema = z.object({
    details: LessonDetailsSchema,
    content: LessonContentSchema,
    quiz: QuizSchema
});

export type FullLessonFormType = z.infer<typeof FullLessonSchema>;

type SingleQuestion = z.infer<typeof SingleQuestionSchema>;
type MultipleQuestion = z.infer<typeof MultipleQuestionSchema>;
type CodeFillQuestion = z.infer<typeof CodeFillQuestionSchema>;

type Question = SingleQuestion | MultipleQuestion | CodeFillQuestion;
export type QuestionError = FieldErrors<Question>;
export type SingleChoiceQuestionError = FieldErrors<SingleQuestion>;
export type MultipleChoiceQuestionError = FieldErrors<MultipleQuestion>;