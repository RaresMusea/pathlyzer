import { QuizType } from '@prisma/client';
import * as z from 'zod';

export const ExaminationCheckSchema = z.object({
    questionId: z.string(),
    quizType: z.nativeEnum(QuizType),
    answer: z.array(z.string()),
}) 