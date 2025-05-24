import * as z from 'zod';

export const FinalizeExaminationSchema = z.object({
    quizId: z.string(),
    gainedXp: z.number(),
    isLastLesson: z.boolean()
}) 