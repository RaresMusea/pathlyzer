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
    type: z.literal("SINGLE"),
    prompt: z.string().min(1, "Prompt is required"),
    order: z.number().int().nonnegative(),
    choices: z.array(
        z.object({
            text: z.string().min(1, "Choice text is required"),
            isCorrect: z.boolean(),
        })
    )
        .min(2, "At least two choices are required")
        .refine((choices) => choices.filter(c => c.isCorrect).length === 1, {
            message: "Exactly one correct answer is required"
        }),
});

const MultipleQuestionSchema = z.object({
    type: z.literal("MULTIPLE"),
    prompt: z.string().min(1),
    order: z.number().int().nonnegative(),
    choices: z.array(
        z.object({
            text: z.string().min(1),
            isCorrect: z.boolean(),
        })
    )
        .min(2)
        .refine((choices) => choices.some(c => c.isCorrect), {
            message: "At least one correct answer must be selected"
        }),
});

const CodeFillQuestionSchema = z.object({
    type: z.literal("CODE_FILL"),
    prompt: z.string().min(1),
    order: z.number().int().nonnegative(),
    codeSections: z.array(
        z.object({
            code: z.string().min(1, "Code section is required"),
            language: z.string().optional(),
            correct: z.array(z.string().min(1)).min(1)
        })
    ).min(1, "At least one code section is required")
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
